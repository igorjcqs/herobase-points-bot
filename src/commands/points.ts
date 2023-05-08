import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from "discord.js";

import axios from "axios";
import { prisma } from "..";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pontos")
    .setDescription("Administra os pontos de um usuário.")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("ação")
        .setDescription("Ação que irá ser executada.")
        .setRequired(true)
        .setChoices(
          { name: "Adicionar", value: "add" },
          { name: "Remover", value: "remove" },
          { name: "Ver", value: "info" }
        )
    )
    .addUserOption((option: SlashCommandUserOption) =>
      option
        .setName("usuário")
        .setDescription("Usuário a ser modificado.")
        .setRequired(true)
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("quantidade")
        .setDescription("Quantidade de pontos a ser adicionado ou removido.")
    ),
  async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const action = interaction.options.get("ação")!.value as string;
    const user = interaction.options.get("usuário");
    var quantity = interaction.options.get("quantidade")!.value as Number;

    if (
      interaction.guild?.members.cache
        .get(interaction.user.id)
        ?.roles.cache.has(process.env.ADM_ROLE!)
    ) {
      if (action === "info" && user) {
        const res = await axios.get(
          "https://discord.com/api/v9/users/" + user!.user!.id,
          {
            headers: {
              Authorization: "Bot " + process.env.DISCORD_TOKEN,
            },
          }
        );

        prisma.user
          .upsert({
            where: {
              discordId: user!.user!.id,
            },
            update: {
              name: res.data.username,
              avatar:
                "https://cdn.discordapp.com/avatars/" +
                user!.user!.id +
                "/" +
                res.data.avatar +
                ".png",
            },
            create: {
              name: res.data.username,
              avatar:
                "https://cdn.discordapp.com/avatars/" +
                user!.user!.id +
                "/" +
                res.data.avatar +
                ".png",
              discordId: user!.user!.id,
            },
          })
          .then(async (user) => {
            await interaction.reply({
              content: `**SUCESSO**: O usuário <@${user.discordId}> possui um total de **${user.points}** pontos.`,
              ephemeral: true,
            });
          });
      }

      if (action === "add" && user) {
        if (quantity) {
          if (typeof Number(quantity) === "number") {
            const res = await axios.get(
              "https://discord.com/api/v9/users/" + user!.user!.id,
              {
                headers: {
                  Authorization: "Bot " + process.env.DISCORD_TOKEN,
                },
              }
            );

            prisma.user
              .upsert({
                where: {
                  discordId: user!.user!.id,
                },
                update: {
                  name: res.data.username,
                  avatar:
                    "https://cdn.discordapp.com/avatars/" +
                    user!.user!.id +
                    "/" +
                    res.data.avatar +
                    ".png",
                },
                create: {
                  name: res.data.username,
                  avatar:
                    "https://cdn.discordapp.com/avatars/" +
                    user!.user!.id +
                    "/" +
                    res.data.avatar +
                    ".png",
                  discordId: user!.user!.id,
                },
              })
              .then(async (user) => {
                await interaction.reply({
                  content: `Parabéns <@${
                    user.discordId
                  }>! Você ganhou **${Number(quantity)} Pontos!**`,
                });

                await prisma.user.update({
                  where: {
                    id: user.id,
                  },
                  data: {
                    points: user.points + Number(quantity),
                  },
                });
              });
          } else {
            await interaction.reply({
              content: `**ERRO**: A quantidade informada precisa ser um número.`,
              ephemeral: true,
            });
          }
        } else {
          await interaction.reply({
            content: `**ERRO**: Você precisa informar uma quantidade ao adicionar pontos à um usuário.`,
            ephemeral: true,
          });
        }
      }

      if (action === "remove" && user) {
        if (quantity) {
          if (typeof Number(quantity) === "number") {
            const res = await axios.get(
              "https://discord.com/api/v9/users/" + user!.user!.id,
              {
                headers: {
                  Authorization: "Bot " + process.env.DISCORD_TOKEN,
                },
              }
            );

            prisma.user
              .upsert({
                where: {
                  discordId: user!.user!.id,
                },
                update: {
                  name: res.data.username,
                  avatar:
                    "https://cdn.discordapp.com/avatars/" +
                    user!.user!.id +
                    "/" +
                    res.data.avatar +
                    ".png",
                },
                create: {
                  name: res.data.username,
                  avatar:
                    "https://cdn.discordapp.com/avatars/" +
                    user!.user!.id +
                    "/" +
                    res.data.avatar +
                    ".png",
                  discordId: user!.user!.id,
                },
              })
              .then(async (user) => {
                if (user.points >= Number(quantity)) {
                  await interaction.reply({
                    content: `Putz <@${
                      user.discordId
                    }>! Infelizmente você perdeu **${Number(
                      quantity
                    )} Pontos!**`,
                  });

                  await prisma.user.update({
                    where: {
                      id: user.id,
                    },
                    data: {
                      points: user.points - Number(quantity),
                    },
                  });
                } else {
                  await interaction.reply({
                    content: `**ERRO**: A quantidade a ser retirada é maior do que a quantidade total de pontos do usuário, cujo tem: **${user.points}** pontos.`,
                    ephemeral: true,
                  });
                }
              });
          } else {
            await interaction.reply({
              content: `**ERRO**: A quantidade informada precisa ser um número.`,
              ephemeral: true,
            });
          }
        } else {
          await interaction.reply({
            content: `**ERRO**: Você precisa informar uma quantidade ao adicionar pontos à um usuário.`,
            ephemeral: true,
          });
        }
      }
    } else {
      await interaction.reply({
        content: `**ERRO**: Você não tem permissão!`,
        ephemeral: true,
      });
    }
  },
};
