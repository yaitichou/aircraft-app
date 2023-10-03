import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {catchError, map, tap } from 'rxjs/operators';



interface Detection {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
  plane: Plane;
}

interface Plane {
  class: number,
  name: string,
}

@Injectable({
  providedIn: 'root'
})

export class AircraftDetectionService {

  constructor(public httpClient: HttpClient) { }

  postFile(fileToUpload: File) {

    const endpoint = 'http://localhost:4200/api';
    var formData: FormData = new FormData();

    // Call the API endpoint to upload file
    formData.append("file",fileToUpload) ;
    return this.httpClient.post<Detection[]>(endpoint, formData).pipe(
      tap(
        (error: any) => {
          console.log(error)
        }
      )
    )
}
  handleError(e: any) {
    throw new Error('Data transmission error');
  }
}
