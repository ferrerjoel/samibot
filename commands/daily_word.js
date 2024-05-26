const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily_word")
    .setDescription("Daily word")
    .addStringOption((option) =>
      option
        .setName("lang")
        .setDescription("Language of the word definition")
        .setRequired(true)
        .addChoices(
          { name: "English", value: "en" },
          { name: "Spanish", value: "es" }
        )
    ),
  async execute(interaction) {
    try {
      await interaction.reply({ content: "Fetching data... Please wait!" });

      const lang = interaction.options.getString("lang");

      const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        defaultViewport: null,
        headless: "new",
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      );

      let url = "";

      switch (lang) {
        case "en":
          url = "https://wol.jw.org/en/wol/publication/r1/lp-e/nwtstg";
          break;
        case "es":
          url = "https://wol.jw.org/es/wol/publication/r4/lp-s/nwtstg"
          break;
        default:
          url = "https://wol.jw.org/en/wol/publication/r1/lp-e/nwtstg";
          break;
      }

      // Read existing JSON file if it exists, otherwise create an empty glossary object
      let glossary = {};
      const filePath = `./data/daily_word/daily_word_${lang}.json`
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);
        glossary = JSON.parse(fileContent);
      }

      const todayDate = new Date().toISOString().split("T")[0];

      // Check if the date variable in the file is less than today's date
      if (glossary.date == undefined || glossary.date < todayDate) {

        await page.goto(url);

        await page.waitForSelector('ul.directory.thumbnails');

        const texts = await page.$$eval('ul.directory.thumbnails li.row.card.navCard a', links =>
          links
              .map(link => link.getAttribute('href'))
              .filter(href => href !== null)
        );

        const todayWord = texts[Math.floor(Math.random() * texts.length)];

        // Update glossary object
        glossary = {
          date: todayDate,
          today_word: todayWord,
          terms: texts
        };

        // Write glossary object to JSON file
        fs.writeFileSync(filePath, JSON.stringify(glossary, null, 2));
      }

      url = glossary.today_word;

      await page.goto(url);

      await page.waitForSelector("#p2");

      const word = await page.$eval("#p1", element => element.textContent.trim());
      const word_definition = await page.$eval("#p2", element => element.textContent.trim());

      const embed = new EmbedBuilder()
        .setColor("496DA7")
        .setTitle(word)
        .setDescription(word_definition)
        .setURL(url)
        .setThumbnail(
          "https://assetsnffrgf-a.akamaihd.net/assets/a/nwtstg/univ/wpub/nwtstg_univ_lg.jpg"
        );

      await interaction.editReply({ content: "", embeds: [embed] });

      await browser.close();
    } catch (error) {
      console.log(error);
    }
  },
};
