import { PrismaClient } from "@prisma/client";
import { CronJob } from "cron";
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  TextChannel,
} from "discord.js";
import * as fs from "fs";
import { GoogleSpreadsheet } from "google-spreadsheet";
import * as path from "path";
import { sendRankingMessage, updateGoogleTable } from "./utils";

require("dotenv").config();

export const prisma = new PrismaClient();

export const doc = new GoogleSpreadsheet(
  "1nzAR0Rgh3nyIp55DEsnZGDxTZFissP1_Q8qmgUv0m4Q"
);

export const client: any = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

const commands = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log(`INFO: Atualizando ${commands.length} comandos!`);

    await doc
      .useServiceAccountAuth({
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCrl2Sqs4iJ++EX\nERSFG5Va+vy5j5y6jEabNZphgv0GKBNnXaIQoOERtVWnwwAPXIQm6GhqydqrKbaI\nagEeM0uoienEXbX+Qc9hIs8zec7jbxGBSEHJou8HXCmSGNF/uw3+GOlGmM40HTyx\ntww9viqbd9uy63QNzgb4ntRuDdGTQU9/fHTkeA11W+I1HxarcjX1N1BoZVP7GwE/\n9wPpWCZ3pmewWsJk3Bn16yzr90g2QAypY/odIf2bOTzXIYWST4vxBnHKJbN1joK0\nMyXRzpeL5IeBrKTGNXpUUxJMOa49iM5kXdScdEd+i9/muHwBp0R5BzUI0F1oqi8v\ntStwwVrhAgMBAAECggEAIyxjbEJlCLPjDhFoPWjMEtxEFd2EaRD8IDC6tqZdK3fn\nkla1M+dme3TKXBsy1fNG+5rEXK+H7XIdgpUIKaKmLaQnkSMMfVQMKIM0Kf8cE67e\nzbt8ENMfYEjaFKKVvzMeySleGCSWkEQ1/s/g6H8kyL2nAWQWZAYJk8krDmwyu5Zf\nkOD3bVmXS+YBhHoY1qkpYhOabHbHMS0l1EjoW9JDor8+eMThizKdt0H8lsYDl9cQ\nPJESFBd90lyO6kD7JA3e8iivaJJajztLYoP1p6l/3bMfAJtE+ueMN9iqh3qOqLxi\nAOMMcMDN+DbU3cAuoVbv8rdOMuoY2wUivk8ospo/aQKBgQDgItJpVa4f9hDh/Rm+\nXORBNu9v0z3CsqWSbvWhhFNvyXE/zHILa+ThN33Fa6Vqe8cG2odTLvl9CxOOqn1u\nLsfSJkHBlHRUEEdPQAjb+UO885yMJ84fOwlhBSB1s/wFKa/BsrheBe2crmQFSHl3\nGeW9Fyu4yB/peNHzFjGmbPKKPwKBgQDD/ESpJVnTx/yAMMlyDmleD9w9Hi7uAtI3\nkIFkIkWhDTRokQb4S6DNw+IRnq8LKTblfvQnsIAzPHIIcmNtKOTt5BT2AecgofSj\nWt8DdbIBELw1+Q8VpIuCs4fJEaVSuofuwGnx2MePAoZaDe7mYvFpUXu63e9N6u2o\niiMnEp2S3wKBgBqsKiv81T7acoHiM8kSltsn5XCCS+w6hDeb2sFA1QkNiNuVwdCY\nI2Glz+LJf6LfXfzzznzYrznxMn+czFZrXL4mbVbTCtDiKwpETYmX7Ta0KuIG7qGK\nzf/ss0MuiwQ2RMMhOI1/2Rn3KtHyIPpKa6uH8V0I+7s19I4gCwKKHobTAoGAPqr/\n2YZT/uBH4UW4ZHwvPSCdL/3iy8CjL5lJhpde5GywgW8+Z07nkGQ+eZvgJRV8tE2w\nDLDnjXqajBDnshQNf/Qar79UBJ9E9qcsAJM15BlR1YBaTnVbFuQJW0YFMzrqFHH6\nbpb+2L/Z7hnedlTVFPQ1OD+XMbcZX3csXmYZdMkCgYBCvydNl5d0bjBrV1oIasud\n/NkdE6eAiRwqYUhSk6HIR0emwjIguEEDNJxMPGVz1B1edig8fodFdo4Js0zRD/ZY\n1I1FtLS6JVF09nnIu7I3gMtVIJJ4p9SUut7umBwac2DiI2/YO6BeOBigVYrC1mXy\nYr1axP9B0mZid/0UaQyYZQ==\n-----END PRIVATE KEY-----\n",
        client_email:
          "herobase-points@herobase-exp-ranking.iam.gserviceaccount.com",
      })
      .catch((err) => {
        console.log(err.response.data);
      });

    await doc.loadInfo();

    const data: any = await rest.put(
      Routes.applicationGuildCommands(
        process.env.APPLICATION_ID!,
        process.env.GUILD_ID!
      ),
      { body: commands }
    );

    console.log(`INFO: ${data.length} comandos foram atualizados com sucesso!`);
  } catch (error) {
    console.error(error);
  }
})();

client.on(Events.InteractionCreate, async (interaction: any) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "Ocorreu um erro ao executar esse comando.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Ocorreu um erro ao executar esse comando.",
        ephemeral: true,
      });
    }
  }
});

new CronJob(
  "*/5 * * * *",
  async function () {
    const channel = client.channels.cache.get(
      process.env.RANKING_CHANNEL!
    ) as TextChannel;

    sendRankingMessage(channel);
  },
  null,
  true,
  "America/Sao_Paulo"
);

new CronJob(
  "*/1 * * * *",
  async function () {
    await updateGoogleTable();
  },
  null,
  true,
  "America/Sao_Paulo"
);

const main = async () => {
  try {
    console.info("INFO: Iniciando bot...");
    await client.login(process.env.DISCORD_TOKEN);
    console.info("INFO: Bot iniciado com sucesso.");
  } catch (error) {
    console.error("ERROR: " + error);
    client.destroy();
    process.exit(1);
  }
};

main();
