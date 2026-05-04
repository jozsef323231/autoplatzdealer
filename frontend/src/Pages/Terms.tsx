import { LanguageCtx } from "../App";
import { useContext } from "react";
import "./Terms.css";

function Terms() {
  const langCtx = useContext(LanguageCtx);

  const termsContent = {
    hu: {
      title: "Általános Szerződési és Felhasználási Feltételek (ÁSZF)",
      sections: [
        {
          heading: "1. Bevezetés",
          content: "Jelen Általános Szerződési és Felhasználási Feltételek (ÁSZF) az Auto Platz Kft. (a továbbiakban: Szolgáltató) által nyújtott szolgáltatások igénybevételének feltételeit tartalmazza. Az oldal használatával Ön elfogadja ezen felhasználási feltételeket."
        },
        {
          heading: "2. Szolgáltatások",
          content: "Az Auto Platz Kft. online autókereskedési platform, amely lehetővé teszi az ügyfelek számára az eladó autók böngészését, adatainak megtekintését és időpontfoglalást. Nem értékesítünk közvetlenül az interneten keresztül, hanem fizikai helyszíneinken találkozunk az ügyfelekkel."
        },
        {
          heading: "3. Felhasználó Fiókok",
          content: "A felhasználó regisztrációjával elfogadja, hogy pontosan és Reálisan kitöltötte az adatokat. Az Ön jelszava bizalmas, ezért kizárólag az Ön felelőssége annak megőrzése. Az Ön fiók által végzett összes aktivitás az Ön felelőssége. Haladéktalanul értesítsen bennünket, ha úgy gondolja, hogy fiókinformáció engedély nélkül lett felhasználva."
        },
        {
          heading: "4. Lemondás a Szavatosságról",
          content: "Az weboldalon elérhető információ az 'ahogy van' alapon biztosított. A Szolgáltató nem nyújt semmilyen szavatosságot az információ pontosságáról, teljességéről vagy megfelelőségéről. Az oldal használatával járó kockázatot teljes mértékben az Ön viseli."
        },
        {
          heading: "5. Felhasználói Magatartás",
          content: "Ön vállalja, hogy az oldalt kizárólag jogszerűen és az ÁSZF-nek megfelelően fogja használni. Nem szabad a weboldalt vagy annak bármely részét másolni, módosítani, szaporítani, továbbítani vagy értékesíteni anélkül, hogy a Szolgáltatótól erre előzetes írásos engedélyt kapott volna."
        },
        {
          heading: "6. Szellemi Tulajdon",
          content: "Az oldalon látható összes tartalom, beleértve a szövegeket, grafikákat, logókat, képeket és szoftvereket, az Auto Platz Kft. vagy licencpartnerei szellemi tulajdonát képezik. Az oldal internetes böngészésére vonatkozóan személyes, nem kereskedelmi célokra korlátozott licencet kap."
        },
        {
          heading: "7. Adatvédelem",
          content: "A rendszer a működéshez szükséges adatokat kezeli, különösen: felhasználói adatok, járműadatok, rendszerhasználati információk. Az adatkezelés célja a szolgáltatás működtetése és fejlesztése. Az adatkezelés jogalapja a szolgáltatás nyújtása és a felhasználói szerződés teljesítése. Az adatokat harmadik félnek nem adjuk át, kivéve a jogszabályban előírt eseteket."
        },
        {
          heading: "8. Felelősség Korlátozása",
          content: "Az Szolgáltató nem felel semmilyen közvetett, mellékhatásként keletkező vagy szokásos kártérítésért, amelyek az oldal használatából vagy az oldal használhatatlanságából erednek, még akkor sem, ha a Szolgáltató értesült az ilyen kár lehetőségéről."
        },
        {
          heading: "9. Módosítások",
          content: "A Szolgáltató jogosult a jelen ÁSZF-et bármikor módosítani. A módosítások hatályba lépnek az oldal frissítésekor. Az oldal további használata az új feltételek elfogadásának tekintendő."
        },
        {
          heading: "10. Kapcsolatfelvétel",
          content: "Kérdéseivel vagy észrevételeivel forduljon hozzánk a support@autoplatz.hu e-mail címen vagy az 1061 Budapest, Andrássy utca 26. címen."
        }
      ]
    },
    en: {
      title: "Terms of Service",
      sections: [
        {
          heading: "1. Introduction",
          content: "These Terms of Service ('ToS') contain the conditions for using the services provided by Auto Platz Kft. (hereinafter: Service Provider). By using this website, you accept these terms of use."
        },
        {
          heading: "2. Services",
          content: "Auto Platz Kft. is an online car trading platform that allows customers to browse available cars, view their details, and book appointments. We do not sell directly over the internet, but meet with customers at our physical locations."
        },
        {
          heading: "3. User Accounts",
          content: "By registering, you confirm that you have completed the information accurately and honestly. Your password is confidential and it is solely your responsibility to keep it secure. All activities performed through your account are your responsibility. Please contact us immediately if you believe your account information has been used without authorization."
        },
        {
          heading: "4. Disclaimer of Warranties",
          content: "Information provided on the website is provided 'as is'. The Service Provider provides no warranty regarding the accuracy, completeness, or suitability of the information. You assume full risk associated with the use of this website."
        },
        {
          heading: "5. User Conduct",
          content: "You agree to use the website only in a lawful manner and in compliance with these Terms of Service. You may not copy, modify, distribute, transmit, or sell the website or any part of it without prior written permission from the Service Provider."
        },
        {
          heading: "6. Intellectual Property",
          content: "All content on the website, including text, graphics, logos, images, and software, is the intellectual property of Auto Platz Kft. or its licensors. You receive a limited license to this website for personal, non-commercial use only."
        },
        {
          heading: "7. Privacy Policy",
          content: "For more information about how we process your personal data, please see our Privacy Policy. You expressly consent to the processing of your personal data in accordance with these Terms of Service."
        },
        {
          heading: "8. Limitation of Liability",
          content: "The Service Provider is not liable for any indirect, consequential, or incidental damages arising from the use of the website or the inability to use the website, even if the Service Provider was aware of the possibility of such damage."
        },
        {
          heading: "9. Amendments",
          content: "The Service Provider reserves the right to modify these Terms of Service at any time. Amendments become effective upon updating the website. Continued use of the website is deemed acceptance of the new terms."
        },
        {
          heading: "10. Contact Us",
          content: "If you have any questions or comments, please contact us at support@autoplatz.hu or at 26 Andrassy St., 1061 Budapest, Hungary."
        }
      ]
    },
    de: {
      title: "Allgemeine Geschäftsbedingungen",
      sections: [
        {
          heading: "1. Einleitung",
          content: "Diese Allgemeinen Geschäftsbedingungen enthalten die Bedingungen für die Nutzung der von Auto Platz GmbH angebotenen Dienste. Durch die Nutzung dieser Website akzeptieren Sie diese Nutzungsbedingungen."
        },
        {
          heading: "2. Dienstleistungen",
          content: "Auto Platz GmbH ist eine Online-Autohändelplattform, die es Kunden ermöglicht, verfügbare Autos zu durchsuchen, ihre Details anzuzeigen und Termine zu buchen. Wir verkaufen nicht direkt über das Internet, sondern treffen uns mit Kunden an unseren physischen Standorten."
        },
        {
          heading: "3. Benutzerkonten",
          content: "Durch die Registrierung bestätigen Sie, dass Sie die Informationen korrekt und ehrlich ausgefüllt haben. Ihr Passwort ist vertraulich und es ist ausschließlich Ihre Verantwortung, es sicher aufzubefahren. Alle Aktivitäten, die über Ihr Konto ausgeführt werden, sind Ihre Verantwortung. Kontaktieren Sie uns sofort, wenn Sie der Meinung sind, dass Ihre Kontoinformationen ohne Genehmigung verwendet wurden."
        },
        {
          heading: "4. Ausschluss von Gewährleistungen",
          content: "Auf der Website bereitgestellte Informationen werden 'wie besehen' bereitgestellt. Der Dienstanbieter übernimmt keine Garantie für die Richtigkeit, Vollständigkeit oder Eignung der Informationen. Sie tragen das volle Risiko für die Nutzung dieser Website."
        },
        {
          heading: "5. Benutzerverhalten",
          content: "Sie erklären sich damit einverstanden, die Website nur auf rechtmäßige Weise und in Übereinstimmung mit diesen Nutzungsbedingungen zu nutzen. Sie dürfen die Website oder einen Teil davon nicht kopieren, ändern, verbreiten, übertragen oder verkaufen, ohne vorherige schriftliche Genehmigung des Diensteanbieters."
        },
        {
          heading: "6. Geistiges Eigentum",
          content: "Alle Inhalte auf der Website, einschließlich Text, Grafiken, Logos, Bilder und Software, sind geistiges Eigentum von Auto Platz GmbH oder seinen Lizenznehmern. Sie erhalten eine begrenzte Lizenz für diese Website nur für persönliche, nicht kommerzielle Nutzung."
        },
        {
          heading: "7. Datenschutz",
          content: "Weitere Informationen zur Verarbeitung Ihrer personenbezogenen Daten finden Sie in unserer Datenschutzrichtlinie. Sie stimmen der Verarbeitung Ihrer personenbezogenen Daten gemäß diesen Nutzungsbedingungen ausdrücklich zu."
        },
        {
          heading: "8. Haftungsbeschränkung",
          content: "Der Dienstanbieter ist nicht haftbar für indirekte, Folge- oder Zufallsschäden, die sich aus der Nutzung der Website oder der Unmöglichkeit der Nutzung der Website ergeben, auch wenn der Dienstanbieter auf die Möglichkeit solcher Schäden hingewiesen wurde."
        },
        {
          heading: "9. Änderungen",
          content: "Der Dienstanbieter behält sich das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Änderungen treten mit der Aktualisierung der Website in Kraft. Die weitere Nutzung der Website gilt als Annahme der neuen Bedingungen."
        },
        {
          heading: "10. Kontaktieren Sie uns",
          content: "Sollten Sie Fragen oder Anmerkungen haben, kontaktieren Sie uns unter support@autoplatz.hu oder unter der Adresse Andrassy Str. 26, 1061 Budapest, Ungarn."
        }
      ]
    }
  };

  const currentLang = langCtx?.language || "hu";
  const content = termsContent[currentLang as keyof typeof termsContent];

  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1>{content.title}</h1>
        
        {content.sections.map((section, index) => (
          <section key={index} className="terms-section">
            <h2>{section.heading}</h2>
            <p>{section.content}</p>
          </section>
        ))}

        <section className="terms-section last-updated">
          <p><strong>Utolsó frissítés: 2026. április 4.</strong></p>
          <p><strong>Last Updated: April 4, 2026</strong></p>
          <p><strong>Letzte Aktualisierung: 4. April 2026</strong></p>
        </section>
      </div>
    </div>
  );
}

export default Terms;
