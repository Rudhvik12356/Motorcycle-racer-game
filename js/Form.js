class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Enter your username");
    this.playButton = createButton("Play");
    this.titleImage = createImg("assets/title.png", "game title");
    this.greeting = createElement("h2");
  }

  setElementsPosition() {
    this.input.position(width / 2 - 130, height / 2 - 100);
    this.playButton.position(width / 2 - 115, height / 2 - 40);
    this.titleImage.position(200, 100);
    this.greeting.position(width - 1300, height / 2 - 90);
  }

  setElementsStyle() {
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.titleImage.class("gameTitle");
    this.greeting.class("greeting");
  }

  handleButtonPress() {
    this.playButton.mousePressed(() => {
      this.input.hide();
      this.playButton.hide();

      var message = `Hello ${this.input.value()}! </br> Please wait for another player to join....`;
      this.greeting.html(message);

      playerCount += 1;
      player.name = this.input.value();
      player.i = playerCount;
      player.addPlayers();
      player.updateCount(playerCount);
    });
  }

  hide() {
    this.input.hide();
    this.playButton.hide();
    this.greeting.hide();
  }

  show() {
    this.setElementsPosition();
    this.setElementsStyle();
    this.handleButtonPress();
  }
}