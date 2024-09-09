import { PrismaClient } from '@prisma/client';
import { generateSlug } from '../lib';
const prisma = new PrismaClient();
async function main() {
    await prisma.product.create({
        data: {
            title: "Sony PlayStation Portal Remote Player for PS5 Console (CFIJ-18000)",
            slug: await generateSlug("Sony PlayStation Portal Remote Player for PS5 Console (CFIJ-18000)"),
            price: 15990,
            availability: true,
            image: "https://gameone.ph/media/catalog/product/cache/d378a0f20f83637cdb1392af8dc032a2/p/l/playstation_portal_cfij-1800.jpg",
            description: "Features\n\nPut Your PS5 in the Palm of Your Hand - PlayStation Portal Remote Player gives you access to the games on your PS5 over your home Wi-Fi*, letting you jump right into gaming without needing to play on a TV.\nPlay Your Game Collection - PlayStation Portal Remote Player can play compatible games you have installed on your PS5 console, including your favorite games for PS5 and PS4.**\nExperience Breathtaking Immersion with DualSense Wireless Controller Features - Feel the incredible immersion of haptic feedback and adaptive triggers in supported games.\nBeautiful 8” LCD Screen - Take in every exquisite detail of your favorite games as they come alive on a brightly lit and gorgeous full HD screen.\n60fps Capable at 1080p Resolution - PlayStation Portal Remote Player can deliver silky smooth gameplay at up to 60fps with high image clarity on its 1080p resolution screen.\nPlayStation Portal Remote Player can stream compatible games installed on your PS5 console. PlayStation Portal Remote Player requires broadband internet Wi-Fi with at least 5Mbps for use. For a better play experience, a high-speed connection of at least 15Mbps is recommended. The quality and connectivity of your play experience may vary depending on your network environment.\nA PS5 console and account for PlayStation Network is required. The PS5 console must be connected to a broadband internet connection, powered on fully or in Rest Mode, and it must be paired with your PlayStation Portal Remote Player.\nGames that require a VR headset (PlayStation VR or PlayStation VR2) or additional peripherals (other than a DUALSHOCK 4, DualSense, or DualSense Edge wireless controller) are not compatible. Games that must be streamed on PS5 using a PS Plus Premium membership are not compatible. Haptic feedback and adaptive trigger features available when supported by game.\nIndividual game performance will vary based on the specific game being played, and the quality of connectivity in your network environment.Haptic feedback and adaptive trigger features are only available when those features are supported by the game being played.",
            sku: "4948872017084",
            url: "https://gameone.ph/sony-playstation-portal-remote-player-for-ps5-console-cfij-18000.html",
            categories: {
                connectOrCreate: [
                    { where: { name: "PlayStation" }, create: { name: "PlayStation", slug: await generateSlug("PlayStation") } },
                    { where: { name: "Console" }, create: { name: "Console", slug: await generateSlug("Console") } },
                ]
            }
        }
    })

    await prisma.product.create({
        data: {
            title: "PlayStation PS4 Ace Attorney Investigations Collection [R3]",
            slug: await generateSlug("PlayStation PS4 Ace Attorney Investigations Collection [R3]"),
            price: 1795,
            availability: true,
            image: "https://gameone.ph/media/catalog/product/cache/d378a0f20f83637cdb1392af8dc032a2/p/s/ps4_g._ace_attorney_investigations_collection_r3_.jpg",
            description: "Miles Edgeworth's dramatic turnabouts take center stage!Experience both Ace Attorney Investigations games in one gorgeous collection! Step into the shoes of Miles Edgeworth, that prosecutor of prosecutors from the Ace Attorney mainline games!\nLeave the courtroom behind as you walk with Edgeworth around the crime scene, gathering evidence and clues and talking with persons of interest. Use your wit and what you discover to solve tough, intriguing cases through logic and deduction.\nFeatures\n\nBoth games have been given the full HD treatment, including all-new designs for the chibi characters! Classic pixel art style is also available for a more retro vibe!\nQuality of life improvements including Chapter Select have been added, making it a breeze to replay your favorite parts!\nAutoplay and Story Mode have also been added. Autoplay will progress the dialogue for you, while Story Mode will solve even the toughest puzzles on your behalf -- perfect for those who just want to sit back and enjoy a good mystery! *You can turn Story Mode on and off at any time\nA Gallery section packed with bonus materials that are sure to please is also included! View in-game illustrations and character animations along with character design sketches and more! Listen to the background music of each game or bask in the beauty of some orchestral arrangements!",
            sku: "4897077991241",
            url: "https://gameone.ph/playstation-ps4-ace-attorney-investigations-collection-r3.html",
            categories: {
                connectOrCreate: [
                    { where: { name: "PlayStation" }, create: { name: "PlayStation", slug: await generateSlug("PlayStation") } },
                    { where: { name: "PS4 Games" }, create: { name: "PS4 Games", slug: await generateSlug("PS4 Games") } },
                ]
            }
        }
    })
}

main();