import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordTransformation',
  standalone: true
})

export class WordTransformationPipe implements PipeTransform {

  transform(value: string, transformationWord?: string): string {
    
    if (!transformationWord) {
      transformationWord = 'lowercase';
    }

    const wordArr = Array.from(value);
    let transformedValue: string;
    switch(transformationWord.toLowerCase()) {
      case 'uppercase': 
        transformedValue = wordArr.map(letter => letter.toUpperCase()).join('');
        break;

      case 'lowercase': 
        transformedValue = wordArr.map(letter => letter.toLowerCase()).join('');
        break;

      default: 
        alert('Invalid transformation method. Defaulting to lowercase.')
        transformedValue = wordArr.map(letter => letter.toLowerCase()).join('');
    }

    return transformedValue;
  }

}
