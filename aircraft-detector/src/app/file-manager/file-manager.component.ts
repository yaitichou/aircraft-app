import { Component } from '@angular/core';
import { AircraftDetectionService } from '../aircraft-detection.service';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})

export class FileManagerComponent {

    fileName : string = '';
    display : boolean = false;
    planeName : string = '';
    url :string|ArrayBuffer|null = '';
    imagePath: any;

    constructor(private detectionService : AircraftDetectionService) {}

    
    async onFileSelected(event : any) {

        /**
         * Method used when selecting a file.
         * Call processRequest to do an apigateway call.
         * @param event selection event
         */
        
        const file:File = event.target.files[0];

        const reader = new FileReader();
        this.imagePath = event.target.files;

        reader.readAsDataURL(event.target.files[0]); 
        reader.onload = (_event) => { 
                this.url = reader.result; 
        }

        this.processRequest(file)
        
    }

    async onFileDropped(event : any) {

        /**
         * Method used when dropping a file.
         * Call processRequest to do an apigateway call.
         * @param event drop event
         */

        const file:File = event[0];

        const reader = new FileReader();
        this.imagePath = event;

        reader.readAsDataURL(event[0]); 
        reader.onload = (_event) => { 
                this.url = reader.result; 
        }

        this.processRequest(file)
    }

    processRequest(file: File){

        /**
         * Invoke aircraft-detection service to do an apigateway call.
         */

        const threshold = 12;

        if (file) {
            if (file.name.length > threshold){
                this.fileName = file.name.substring(0, threshold-1);
                this.fileName = this.fileName +"...";
            }
            else{
                this.fileName = file.name;
            }
            // Invoke detection service to call for the API
            this.detectionService.postFile(file).subscribe(res => {
                this.planeName = res.detection;
                this.display = true;
            });

        }
    }

}