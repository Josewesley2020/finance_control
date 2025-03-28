import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSelectedService {
  private selectedDateSubject = new BehaviorSubject<string>(''); // Armazena a data inicial no formato 'MAR-2025'
  selectedDate$ = this.selectedDateSubject.asObservable(); // Observable para os componentes se inscreverem

  constructor() {}

  // Método para definir a data
  setDate(date: string): void {
    this.selectedDateSubject.next(date); // Atualiza a data e notifica os inscritos
  }

  // Método para obter a data atual
  getDate(): string {
    return this.selectedDateSubject.getValue(); // Retorna o valor atual da data
  }

  // Método para obter o mês como número (1-12)
  getMonth(): number {
    const date = this.getDate();
    const monthMap: { [key: string]: number } = {
      JAN: 1,
      FEB: 2,
      MAR: 3,
      APR: 4,
      MAY: 5,
      JUN: 6,
      JUL: 7,
      AUG: 8,
      SEP: 9,
      OCT: 10,
      NOV: 11,
      DEC: 12
    };
    const monthAbbreviation = date.split('-')[0]; // Extrai 'MAR' de 'MAR-2025'
    return monthMap[monthAbbreviation] || 0; // Retorna o número do mês ou 0 se inválido
  }

  // Método para obter o ano como número
  getYear(): number {
    const date = this.getDate();
    return parseInt(date.split('-')[1], 10) || 0; // Extrai '2025' de 'MAR-2025'
  }
}
