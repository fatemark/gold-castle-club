function getKingdomType(rarity: number): string {
    switch (rarity) {
        case 13:
            return "Eternal Dominions";
        case 12:
            return "Universal Dominions";
        case 11:
            return "Galactic Dominion";
        case 10:
            return "World Dominion";
        case 9:
            return "Planetary Empire";
        case 8:
            return "Empire";
        case 7:
            return "Kingdom";
        case 6:
            return "Grand Dukedom";
        case 5:
            return "Princedom";
        case 4:
            return "Dukedom";
        case 3:
            return "Barony";
        case 2:
            return "House";
        case 1:
            return "Army";
        case 0:
            return "Commonwealth";
        default:
            return "Kingdom"; // Default to "Kingdom" if rarity is not matched
    }
}

function getbackground(ap: number, gender: string, rarity: number, item: string, allegiance: string, magic: number,
    group_attack: string, solo_attack: string, classtype:string) {
      if (rarity == 13) {
        return 'eternalclass'
      }
    else if (rarity == 12) {
        return 'universalclass'
      }
    else if (rarity == 11) {
        return 'dominatorclass'
      }
    else if (rarity == 10) {
        return 'godclass'
      }
    else if (rarity == 9) {
      return 'planetatorclass'
    }
    else if (ap > 5000) {
      return 'ascendant'
    }
    else if (magic > 10) {
      return 'magicascendant'
    }
    else if (allegiance == "The Planetator's Chosen" || solo_attack == "The Planetator's favorite" || solo_attack == "Consoling the Planetator" || solo_attack == "The Planetator's Justice") {
      return 'planetator'
    }
    else if (rarity == 8) {
      if (gender == 'man') {
      return '8m'
      }
      else if (gender == 'woman') {
      return '8f'
      }
    }
    else if (item == 'Summersword' || item == 'Summerstone') {
      return 'summerstone'
    }
    else if (item == '"Mars shield"' || item == 'Summerstone') {
      return 'mars'
    }
    else if (item == "Celestial relic") {
      return 'celestial'
    }
    else if (item == "Ancient Relic") {
      return 'ancient'
    }
    else if (item == "Chosen's wings" || item == "Chosen sword" || item == "Chosen sword" || allegiance == "Chosen" || allegiance == "Chosen knight") {
      return 'chosen'
    }
    else if (item == "Mars shield") {
      return 'mars'
    }
    else if (allegiance == "Supersoldier") {
      return 'supersoldier'
    }
    else if (group_attack == "Tears on the Black field" || solo_attack == "Death on the Black Field" || solo_attack == "Blessing on the Black field" || group_attack == "Blessing on the Black field") {
      return 'blackfield'
    }
    else if (rarity >= 1 && rarity <= 7) {
      return `${rarity}${gender == 'man' ? 'm' : 'f'}`;
    }
    else if (rarity == 0) {
      if (classtype == 'Soldier Class') {
      return 'soldier'
      }
      else if (classtype == "Merchant Class" || classtype == "Upper Class") {
      return 'merchant'
      }
      else if (classtype == "Commoner Class") {
        return 'citydweller'
        }
      else if (classtype == "Peasant Class") {
        return 'peasant'
        }
    }
    else {
      return '1m'
    }
  }


function getLoverParamour(gender: string, rarity: number) {
    if (gender == 'woman') {
    switch (rarity) {
        case 0:
            return "a boyfriend";
        case 1:
            return "a lover";
        case 2:
            return "a lover";
        case 3:
            return "an admirer";
        case 4:
            return "an admirer";
        case 5:
            return "a suitor";
        case 6:
            return "a companion";
        case 7:
            return "a paramour";
        case 8:
            return "a consort";
        default:
          return 'a companion';
    }
  } else if (gender == 'man') {
    switch (rarity) {
      case 0:
          return "a whore";
      case 1:
          return "a girlfriend";
      case 2:
          return "a lover";
      case 3:
          return "a courtesan";
      case 4:
          return "a mistress";
      case 5:
          return "a mistress";
      case 6:
          return "a companion";
      case 7:
          return "a concubine";
      case 8:
          return "a consort";
      default:
        return 'a companion';
  }
  }
  }

  function getLoverCount(gender: string, lovercount: number): string {
    let genderprefix: string;
    let gendersuffix: string;
  
    if (gender == 'woman') {
      genderprefix = 'She ';
      gendersuffix = 'men';
    } else {
      genderprefix = 'He ';
      gendersuffix = 'man';
    }
  
    if (lovercount === 0) {
      return genderprefix + 'is a virgin';
    } else if (lovercount > 0) {
      return genderprefix + 'has been with ' + lovercount + ' ' + gendersuffix;
    } else {
      return 'Invalid lover count';
    }
  }

  function getgendersuffix(genderinput: string): string {
    if (genderinput == 'man') {
      return 'his'
    }
    else if (genderinput == 'women') {
      return 'her'
    }
    else {
      return 'his'
    }
  }


  function getwartarget(selfwaraddress: string, wartargetaddress: string, wartargetname: string): string {
    if (selfwaraddress == wartargetaddress) {
      return 'is not at war'
    }
    else if (selfwaraddress != wartargetaddress)
    {
      return `is at war with ${wartargetname}`
    }
    else {
      return 'is not at war'
    }
  }



  const adjustFontSize = (input: HTMLInputElement) => {
    const container = input.parentNode as HTMLElement; // Cast parentNode to HTMLElement
    const maxWidth = container.offsetWidth - 20; // Adjust for padding
    const inputValue = input.value;
    const numberOfDigits = inputValue.length;
  
    // Determine the approximate width of the text based on the number of digits
    const approximateTextWidth = numberOfDigits * 25; // Adjust the multiplier as needed
  
    // Compare the approximate text width to the container width
    if (approximateTextWidth > maxWidth) {
      // Calculate a new font size based on the available space in the container
      const newFontSize = maxWidth / numberOfDigits;
      input.style.fontSize = `${newFontSize}px`;
    } else {
      // Reset font size if the input value fits within the container
      input.style.fontSize = '40px'; // Reset to default
    }
  };

export { getKingdomType, getbackground, getLoverParamour, getgendersuffix, getLoverCount, getwartarget, adjustFontSize }