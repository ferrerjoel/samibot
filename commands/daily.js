const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const puppeteer = require("puppeteer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Daily text")
    .addStringOption((option) =>
      option
        .setName("lang")
        .setDescription("Language of the text")
        .setRequired(true)
        .addChoices(
          { name: "English", value: "en" },
          { name: "Spanish", value: "es" },
          { name: "Catalan", value: "cat" },
          { name: "Portuguese (Brazil)", value: "pt" },
          { name: "Japanese", value: "ja" },
          { name: "German", value: "de" },
          { name: "Basque", value: "eu" }
        )
    ),
  async execute(interaction) {
    await interaction.reply({ content: "Fetching data... Please wait!" });

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      defaultViewport: null,
      headless: "new",
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    );

    const url = `https://wol.jw.org/${interaction.options.getString("lang")}`

    await page.goto(url);

    await page.waitForSelector(".tabContent.active .bodyTxt"); // Wait for the content section

    // Extract the content
    const title = await page.$eval(".tabContent.active h2", (element) => element.textContent);
    const text = await page.$eval(".tabContent.active .themeScrp", (element) => element.textContent);
    const content = await page.$eval(".tabContent.active .bodyTxt .pGroup", (element) => element.textContent);

    const splitPoint = findSplitPoint(content, content.length);
    const firstHalf = content.slice(0, splitPoint);
    const secondHalf = content.slice(splitPoint);
        
    const embed = new EmbedBuilder()
      .setColor("496DA7")
      .setTitle(title)
      .setDescription(text)
      .setURL(url)
      .setThumbnail(
        "https://img.asmedia.epimg.net/resizer/i6_OJPDtk1j53mPZjjVSZe0MIyM=/1472x1104/cloudfront-eu-central-1.images.arcpublishing.com/diarioas/KKF52TVGVNCKJFW6RGQRBR6OBE.png"
      )
      .addFields({ name: "\u200B", value: firstHalf })
      .addFields({ name: "\u200B", value: secondHalf });

    await interaction.editReply({ content: "", embeds: [embed] });

    await browser.close();

    function findSplitPoint(text, length) {

      const sentenceEnders = [".", "!", "?"];
    
      let splitPoint = 0;
      let prevEnder = -1;
    
      for (let i = 0; i < length; i++) {

        if (sentenceEnders.includes(text[i])) {
          prevEnder = i;
        }
    
        if (i >= length / 2 && prevEnder >= 0) {
          splitPoint = prevEnder + 1; 
          break;
        }
      }
    
      if (splitPoint === 0) {
        splitPoint = Math.floor(length / 2);
      }
    
      return splitPoint;
    }
  },
};
