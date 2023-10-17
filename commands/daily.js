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
          { name: "Catalan", value: "cat" }
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

    await page.goto(
      `https://wol.jw.org/${interaction.options.getString("lang")}`
    );

    await page.waitForSelector("#p50");
    await page.waitForSelector("#p51");
    await page.waitForSelector("#p52");

    const title = await page.$eval("#p50", (element) => element.textContent);
    const text = await page.$eval("#p51", (element) => element.textContent);
    const content = await page.$eval("#p52", (element) => element.textContent);

    const embed = new EmbedBuilder()
      .setColor("496DA7")
      .setTitle(title)
      .setURL("https://wol.jw.org/es/wol/h/r4/lp-s")
      .setThumbnail(
        "https://img.asmedia.epimg.net/resizer/i6_OJPDtk1j53mPZjjVSZe0MIyM=/1472x1104/cloudfront-eu-central-1.images.arcpublishing.com/diarioas/KKF52TVGVNCKJFW6RGQRBR6OBE.png"
      )
      .addFields({ name: text, value: content });

    await interaction.editReply({ content: "", embeds: [embed] });

    await browser.close();
  },
};
