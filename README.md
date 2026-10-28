# [DiceBee](https://dicebee.com/) — a browser-based dice roller for tabletop and game development

I built this as a lightweight utility for anyone who needs fair random dice outcomes without juggling physical dice or installing an app. [DiceBee](https://dicebee.com/) runs entirely in the browser. There is no backend server processing your inputs, and no roll data ever leaves your machine.

You can select between 1 and 20 dice per round, with standard side counts ranging from d4 up to d100. Instead of relying on predictable math library shortcuts, each result is generated using the browser's built-in secure random generator. This ensures every face is equally likely without repeating patterns. After the tumbling animation settles, the tool automatically computes the total, average, minimum, and maximum for that specific round. A roll history is kept visible directly on the page so you can trace previous outcomes. No sign-up is required to access any of these features.

A quick example of a typical session:

```text
Input: 2d6
Output: [4, 3] | Total: 7 | Avg: 3.5 | Min: 3 | Max: 4
```

You simply pick your face count and quantity, and the computed stats are returned immediately.

## Where to read more

Complete tutorials, worked examples and the full documentation live on the site: [DiceBee](https://dicebee.com/)

## License

Source code is MIT-licensed. Website articles and descriptive content are NOT included in this license and remain copyrighted.
