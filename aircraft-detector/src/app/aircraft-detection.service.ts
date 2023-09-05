import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';



export interface DetectionResponse {
  detection : string;
}

@Injectable({
  providedIn: 'root'
})


export class AircraftDetectionService {

  constructor(public httpClient: HttpClient) { }

  postFile(fileToUpload: File) {
    const endpoint = 'http://localhost:8080/detection';
    const formData: FormData = new FormData();
    formData.append("image",fileToUpload);

    return this.httpClient.post<DetectionResponse>(endpoint, formData)
}
  handleError(e: any) {
    throw new Error('Erreur de transmission des données.');
  }
}
