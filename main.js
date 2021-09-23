const prompt = require("prompt-sync")({ sigint: true });
const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

const arrayArgument = [
  [pathCharacter, fieldCharacter, hole],
  [fieldCharacter, hole, fieldCharacter],
  [fieldCharacter, hat, fieldCharacter],
];
const currentPositionHat = [0, 0];

/* funcion de pregunta al usuario dirección */
const promptMessage = (obj) => {
  let endGame = false;

  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const operations = (obj, name) => {
    let firtsLetter = name.toLowerCase().charAt(0);

    if (firtsLetter == "d" || firtsLetter == "u") {
      obj.setPositionHatY = firtsLetter;
    } else if (firtsLetter == "r" || firtsLetter == "l") {
      obj.setPositionHatX = firtsLetter;
    }
    if (obj.isOutside() || obj.foundHole()) {
      endGame = true;
    } else {
      endGame = obj.movePathCharacter(endGame);
    }
    if (!endGame) {
      readLine();
    }
  };

  const readLine = () => {
    readline.question("Which way?", (name) => {
      let move = "";

      switch (name.toLowerCase().charAt(0)) {
        case "d":
          operations(obj, name);
          break;
        case "u":
          operations(obj, name);
          break;
        case "r":
          operations(obj, name);
          break;
        case "l":
          operations(obj, name);
          break;
        default:
          console.log(`${name} is a wrong way`);
          obj.print();
          operations(obj, name);
          break;
      }
      if (endGame) {
        readline.close();
      }
    });
  };

  if (!endGame) {
    readLine();
  } else {
    console.log("close");
  }
};

/*creacion de la clase */
class Field {
  constructor(bodyField, positionHat) {
    this.bodyField = bodyField;
    this.positionHat = positionHat;
  }

  get getBodyField() {
    return this.bodyField;
  }
  get getPositionHat() {
    return this.positionHat;
  }
  set setPositionHatX(direction) {
    if (direction == "r") {
      this.positionHat[1]++;
    } else {
      this.positionHat[1]--;
    }
  }
  set setPositionHatY(direction) {
    if (direction == "d") {
      this.positionHat[0]++;
    } else {
      --this.positionHat[0];
    }
  }

  /*metodo que muestra en pantalla la ubicación del hat  */
  print() {
    for (let i = 0; i < this.bodyField.length; i++) {
      console.log(this.bodyField[i]);
    }
  }

  /*Assign a path character to next step*/
  movePathCharacter(appeared) {
    let currentPositionHat = this.positionHat;
    let bodyField = this.bodyField;
    for (let i = currentPositionHat[0]; i < bodyField.length; i++) {
      for (let j = currentPositionHat[1]; j < bodyField[i].length; j++) {
        if (i == currentPositionHat[0] && j == currentPositionHat[1]) {
          if (!this.foundHat(bodyField[i][j])) {
            bodyField[i][j] = pathCharacter;
          } else {
            appeared = true;
          }
        }
      }
    }
    this.print();
    return appeared;
  }

  /*to validate next step is a hat*/
  foundHat(moveHat) {
    let foundHat = false;
    if (moveHat == hat) {
      foundHat = true;
    }
    return foundHat;
  }
  /*to validate next step is a hole*/
  foundHole() {
    let foundHole = false;
    let currentPositionX = this.positionHat[1];
    let currentPositionY = this.positionHat[0];

    if (this.bodyField[currentPositionY][currentPositionX] == hole) {
      foundHole = true;
      console.log("You Loose, found a Hole, try again!!!!");
    }
    return foundHole;
  }
  /*to validate next step is a outside of field*/
  isOutside() {
    let isOut = true;
    let currentPositionX = this.positionHat[1];
    let currentPositionY = this.positionHat[0];
    if (
      currentPositionX >= 0 &&
      currentPositionX < this.bodyField[0].length &&
      currentPositionY < this.bodyField.length &&
      currentPositionY >= 0
    ) {
      isOut = false;
    } else {
      console.log("you´re outbound, you loose, Try again!!!");
    }
    return isOut;
  }

  static generateField(height, width) {
    let randomField = [];
    let concatField = [];
    let arrayCharacteres = [hat, hole, fieldCharacter, pathCharacter];

    const getRamdonIndex = (dimension) => {
      return Math.floor(Math.random() * dimension);
    };

    const isThereHat = (row, col, field) => {
      let found = false;
      for (let i = row; i >= 0; i--) {
        for (let j = col; j >= 0; j--) {
          console.log(i, "i");
          console.log(j, "j");
          if (field != undefined) {
            if (field[i][j] == arrayCharacteres[0]) {
              found = true;
            }
          }
        }
      }
      return found;
    };
    const addCharacter = (isThere) => {
      let addIt = arrayCharacteres[0];
      if (isThere) {
        while (addIt != arrayCharacteres[0]) {
          addIt = arrayCharacteres[getRamdonIndex(arrayCharacteres.length)];
        }
      } else {
        addIt = arrayCharacteres[getRamdonIndex(arrayCharacteres.length)];
      }

      return addIt;
    };

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        randomField.push(
          addCharacter(isThereHat(i, j, (concatField[i] = randomField)))
        );
      }
      // concatField[i] = randomField;
      randomField = [];
    }
    return concatField;
  }
}

/*Building object*/
const myField = new Field(arrayArgument, currentPositionHat);
myField.print();
promptMessage(myField);
