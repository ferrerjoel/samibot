const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

module.exports = {
  data: new SlashCommandBuilder().setName("daily").setDescription("Daily text"),
  async execute(interaction) {

    await interaction.reply({ content: "Fetching data... Please wait!", ephemeral: true });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://wol.jw.org/es/wol/h/r4/lp-s");

    await page.waitForSelector("#p52");

    const content = await page.$eval(
      "#dynamic-content",
      (element) => element.textContent
    );

    await interaction.editReply({ content: element.textContent });

    await browser.close();
  },
};
