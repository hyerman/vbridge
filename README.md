# Vbridge

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.10.

## Vanishing Bridge Scorekeeping Web App
This web app is for keeping score in a game my family calls Vanishing Bridge. Other names for the game are Oh Hell and Screw Your Neighbor. 
Here is a good description of the game https://www.pagat.com/exact/ohhell.html. 
We usually play with these varients:
- Spades are always trump
- The bids can add up to the number of cards
- THe very first card led of each hand cannot be a spade (unless all the player has is a spade)
- With scoring, you get the points you get, plus the bonus of 10 if you get match your bid.
- With four players we start with 13 cards and work down to 1
- If we are in a hurry, we often skip every other hands

## Known Issues
This web app has several know issues. Most are related to lack of select (dropdown) support in Angular Material 2 right now. When that comes out I will
update the app to use the Material Design components. 
- If you use it on your phone you will get those ugly select menus
- Chrome implements select differently than IE and Firefox. Only Chrome has a black field when the tied variable is undefined. As a result on IE and FF, if you want to set a dropdown to zero you have to select another
  number and then select 0. Trying to include a blank line on IE and FF makes Chrome count wrong when adding up the selects for bids and tricks. Not worth
  fixing before Material comes out.
- There are popups that warn when bids haven't been entered or tricks don't add up to the cards in the hand. These are implemented as simple alerts for now.
