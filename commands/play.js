const { SlashCommandBuilder } = require("discord.js");
const {
  getVoiceConnection,
  entersState,
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  StreamType,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const axios = require("axios");

const queue = []; // Queue to hold the URLs to be played
let isPlaying = false; // Flag to track if audio is currently playing
const player = createAudioPlayer();

module.exports = {
  player,
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays an online audio")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("URL of the file to play")
        .setRequired(true)
    ),
  async execute(interaction) {
    const voiceChannelId = interaction.member.voice.channelId;

    if (!voiceChannelId) {
      return interaction.reply(
        "You need to be in a voice channel to use this command."
      );
    }

    const voiceConnection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: interaction.guildId,
      adapterCreator: interaction.channel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    const connection = getVoiceConnection(interaction.guildId);

    try {
      await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5000);
      console.log(
        `Connected to voice channel ${voiceChannelId} on guild ${interaction.guildId}`
      );
    } catch (error) {
      console.error("Voice Connection not ready within 5s.", error);
      return interaction.reply({
        content: "Unable to connect to the voice channel.",
        ephemeral: true,
      });
    }

    const mp3Url = interaction.options.getString("url");

    queue.push(mp3Url);

    // If audio is not currently playing, start playing
    if (!isPlaying) {
      playQueue(connection);
    }

    interaction.reply({ content: `Added to the queue ;) Songs left: [${queue.length}]`, ephemeral: true });
  },
};

function playQueue(connection) {

  if (queue.length === 0) {
    isPlaying = false;
    return;
  }

  isPlaying = true;

  const mp3Url = queue.shift(); 

  // Use axios to get the MP3 file from the URL
  axios
    .get(mp3Url, { responseType: "stream" })
    .then((response) => {
      const stream = response.data;

      const resource = createAudioResource(stream, {
        inlineVolume: true,
        //inputType: StreamType.WebmOpus,
      });
      resource.volume.setVolume(1);

      player.play(resource);

      connection.subscribe(player);

      // Listen for the 'audioPlayerIdle' event to play the next item in the queue
      player.once(AudioPlayerStatus.Idle, () => {
        playQueue();
      });
    })
    .catch((error) => {
      console.error("Error streaming and playing the MP3:", error);
      playQueue();
    });
}
