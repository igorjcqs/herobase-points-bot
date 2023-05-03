import { User } from "@prisma/client";
import { EmbedBuilder, TextChannel } from "discord.js";
import { client, doc, prisma } from "..";

export function testDate(str: string) {
  var t = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (t === null) return false;
  var d = +t[1],
    m = +t[2],
    y = +t[3];

  if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
    return true;
  }

  return false;
}

export function truncate(str: string, n: number, useWordBoundary: boolean) {
  if (str.length <= n) {
    return str;
  }

  const subString = str.slice(0, n - 1);

  return (
    (useWordBoundary
      ? subString.slice(0, subString.lastIndexOf(" "))
      : subString) + "..."
  );
}

export function numberFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}

export async function sendRankingMessage(channel: TextChannel) {
  console.log(`INFO: Enviando ranking para o canal: ${channel.name}.`);

  const server = await prisma.server.findFirst({
    where: {
      active: true,
    },
  });

  const oldMessage = channel.guild.channels.cache.get(server!.rankingMessage);

  if (oldMessage) {
    await oldMessage.delete();
  }

  var rankingPromise: any;

  await prisma.user
    .findMany({
      orderBy: {
        points: "desc",
      },
    })
    .then(async (returnedRanking) => {
      rankingPromise = returnedRanking.map(
        async (value: User, index: number, array: Array<any>) => {
          if (value !== undefined && index <= 49) {
            var user = await client.users.fetch(value.discordId);

            var userName = user
              ? truncate(user.username, 8, false) + "#" + user.discriminator
              : "Desconhecido";

            return (
              "**" +
              (index + 1) +
              ".** `" +
              userName +
              "` **-** " +
              value.points +
              " pontos"
            );
          }
        }
      );
    });

  Promise.all(rankingPromise).then(function (results) {
    var resultString: string = "";

    if (results.length !== 0) {
      for (var i = 0; i < results.length; i++) {
        if (results[i] !== undefined) {
          if (i % 2 === 0) {
            resultString += results[i] + "‎ ‎ ‎ ‎ ‎ ‎ ‎ ";
          } else {
            resultString += results[i] + "\n";
          }
        }
      }
    } else {
      resultString = "Ninguém desse time ganhou pontos!";
    }

    const rankingMessage = new EmbedBuilder()
      .setColor("#ff5900")
      .setDescription(`**Ranking** \n` + resultString)
      .setFooter({
        text: "Equipe Herobase",
      });

    channel.send({ embeds: [rankingMessage] }).then(async (message) => {
      await prisma.server.update({
        where: {
          active: true,
        },
        data: {
          rankingMessage: message.id,
        },
      });
    });

    console.log("INFO: Mensagem de ranking enviada.");
  });
}

export async function updateGoogleTable() {
  const sheet = doc.sheetsByIndex[0];

  console.log("Atualizando planilha...");

  await prisma.user
    .findMany({
      orderBy: {
        points: "desc",
      },
    })
    .then(async (rows: any) => {
      for (var i = 0; i < rows.length; i++) {
        var result = Object.keys(rows[i]).map((key: string) =>
          JSON.stringify(rows[i][key])
        );

        await sheet.setHeaderRow(result, i + 2).catch((err) => {
          console.log(err);
        });
      }
    });
}
