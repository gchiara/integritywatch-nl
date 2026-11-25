# Data Dictionary — Integrity Watch Nederland (integritywatch.nl)

**Publisher:** Transparency International Nederland (TI-NL)
**Platform:** https://www.integritywatch.nl
**Version:** 1.0 — **Last updated:** 2026-08-17
**Contact:** communicatie@transparency.nl





## How to read this document

Integrity Watch NL currently hosts **four datasets**, matching the four sections of the platform:

|#|Dataset ID|Dataset|Platform section|
|-|-|-|-|
|1|`iwnl-tk-registers`|Tweede Kamer — side activities, gifts and foreign travel|Tweede Kamerleden|
|2|`iwnl-ek-registers`|Eerste Kamer — side activities, gifts and foreign travel|Eerste Kamerleden|
|3|`iwnl-partijfinanciering`|Donations to political parties|Partijfinanciering|
|4|`iwnl-agendas`|Public agendas of ministers and state secretaries|Agenda's|



This dictionary is subdivided into four sections, corresponding to these datasets. Each dataset has a **primary table** (dataset-level description) and a **secondary table** (variable-level description). Variable names are kept in **Dutch**, exactly as they appear in the published files, with an English label added for cross-country comparability.

# 

# 1\. Tweede Kamer — side activities, gifts and foreign travel

## 1.1 Primary table

|||
|-|-|
|**Dataset:**|Tweede Kamerleden (members of parliament) — side activities, gifts and foreign travel (*Tweede Kamerleden: nevenactiviteiten, giften en reizen*), 2017–2026.|
|**Source:**|Tweede Kamer der Staten-Generaal — public registers of side activities and interests, gifts and benefits, and foreign travel (https://www.tweedekamer.nl/kamerleden-en-commissies/integriteit-en-openbare-registers), retrieved via the Tweede Kamer open data service (Odata). Biographical, committee, career and education fields come from the same source. Compiled and restructured by TI-NL.|
|**Description:**|For every sitting member of the House of Representatives the dataset contains: which paid and unpaid positions they hold/held outside parliament and what those positions pay, which gifts worth more than €50 they have accepted and from whom, and which foreign trips they made that were paid for wholly or partly by a third party. The dataset also names a small number of biographical details, parliamentary committee memberships, previous career and education, so that outside interests can be read in context.|
|**Related legislation:**|Gedragscode Leden van de Tweede Kamer der Staten-Generaal (in force since 1 April 2021); Regeling toezicht en handhaving Gedragscode (College van onderzoek integriteit, 1 April 2021); Wet schadeloosstelling leden Tweede Kamer, art. 5 (declaration and offsetting of outside income).|
|**Period covered:**|2017–2026 — the platform holds the current and several previous parliamentary terms|
|**Geographical scope**|National|
|**Notes/Limitations**|Self-declared data. Members enter their own registrations and there is **no sanction in the Netherlands for incomplete or incorrect registration**, so absence of an entry does not prove absence of a side activity, gift or trip. Gift values are frequently recorded as unknown or left blank. Outside income is usually reported as a category or a range rather than an exact amount. Free-text fields (descriptions, employers, funders) are not standardised, so the same organisation may appear under several spellings. The 2021 was deleted by parliament and later scraped by TI-NL using a PDF, it may contain more limited information than usual. Registers are a snapshot: entries removed or corrected by a member after a scrape are not always included in the data. Always verify findings against the original register before publication.|
|**Update frequency**|Annually|
|**Download link**|https://github.com/chiragjaiswar0814/IntegrityWatch|

## 

## 1.2 Secondary table (variables)

|Variable Name|Data Type|Variable Description|Notes/Limitations|Source|
|-|-|-|-|-|
|*— `Persoon` —*|||||
|`Id`|Text|Unique identifier of the member in the Tweede Kamer Gegevensmagazijn|Stable primary key; use this to join all sub-tables via `Persoon\_Id`|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Nummer`|Numeric|Official Tweede Kamer person number|Second stable identifier, human-readable|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Titels`|Text|Academic or honorary titles|Limitation: it is empty for certain members|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Initialen`|Text|Initials|Display name on the platform is assembled from Initialen, Tussenvoegsel, Achternaam and Roepnaam; there is no single name field Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Tussenvoegsel`|Text|Name prefix such as van, de, ter|Empty for certain members; omitting it breaks name matching against other datasets|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Achternaam`|Text|Surname|Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Voornamen`|Text|Full given names|Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Roepnaam`|Text|Name the MP goes by|Often differs from the first given name Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Geslacht`|Categorical|Gender as recorded by the Kamer|Values: man, vrouw Values/format: man; vrouw. Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Functie`|Text|Office held|Always Tweede Kamerlid|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Geboortedatum`|Date|Date of birth|Full ISO timestamp with timezone offset, not a plain date Values/format: ISO 8601 with offset. Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Geboorteplaats`|Text|Place of birth|Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Geboorteland`|Text|Country of birth|Dutch-language country names, not ISO codes Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Woonplaats`|Text|Municipality of residence|Personal data not required by any register. Consider excluding from public downloads Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Land`|Text|Country of residence|ISO-style code, e.g. NL Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Overlijdensdatum`|Date|Date of death|Usually empty.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Overlijdensplaats`|Text|Place of death|Empty for all 149 records Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Fractielabel`|Text|Parliamentary group label|Not used. The group shown on the platform is taken from `FractieZetelPersoon.FractieZetel.Fractie` instead|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`ContentType`|Text|MIME type of the member's photograph|Technical field, relates to the downloaded portrait|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`ContentLength`|Numeric|Byte size of the photograph|Technical field|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`GewijzigdOp`|Date|When the record last changed in the source system|Best available proxy for the snapshot date of the file Values/format: ISO 8601 with offset.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`ApiGewijzigdOp`|Date|When the record last changed in the API layer|Technical field Values/format: ISO 8601 UTC.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Verwijderd`|Boolean|Whether the record has been withdrawn in the source system|TI-NL maintains records. False for all members, but true for some sub-records Values/format: true; false.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|*— `PersoonNevenfunctie` —*|||||
|`Omschrijving`|Text|Description of the position or interest held outside parliament|Free text, no controlled vocabulary; organisation names are not standardised.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`PeriodeVan`|Text|Start of the side activity|Mixed granularity: some records YYYY-MM-DD, some YYYY-MM, some YYYY. Do not parse as a date without handling all three|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`PeriodeTotEnMet`|Text|End of the side activity|Records end-date. Values/format: YYYY|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`IsActief`|Boolean|Whether the side activity is ongoing|Better to use PeriodeTotEnMet instead Values/format: true; false.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`VergoedingSoort`|Categorical|Whether and how the position is remunerated|Values/format: Onbezoldigd; Bezoldigd; Onkostenvergoeding.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`VergoedingToelichting`|Text|Free-text explanation of the remuneration||TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Gewicht`|Numeric|Display sort order|Presentation only, no analytical meaning|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|*— `PersoonNevenfunctieInkomsten` —*|||||
|`Jaar`|Text|Year the income relates to|Values/format: YYYY.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Bedrag`|Numeric|Reported amount|Not standardized by Odata. Only comparable across records without Frequentie and BedragSoort.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`BedragValuta`|Categorical|Currency of the amount|Effectively always EUR Values/format: EUR.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`BedragSoort`|Categorical|Whether the amount is gross or net|Values/format: Bruto; Netto.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Frequentie`|Categorical|Period the amount covers|Values/format: Per maand; Per jaar|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`FrequentieBeschrijving`|Text|Free-text explanation of an irregular payment pattern||TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`BedragVoorvoegsel`|Text|Text placed before the amount||TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`BedragAchtervoegsel`|Text|Text placed after the amount||TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Opmerking`|Text|Additional remark on the income||TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|*— `PersoonGeschenk` —*|||||
|`Omschrijving`|Text|Description of the gift, including what it was, who gave it and often its value in words|Value and donor are embedded in text, and must be extracted by text processing.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/Register of gifts and benefits|
|`Datum`|Date|Date the gift was received|Values/format: ISO 8601 with offset.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Gewicht`|Numeric|Display sort order|Presentation only|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`waarde\_derived`|Text|Gift value as displayed on the platform|Computed client-side by regex from Omschrijving; returns "onbekend", a matched `€`-amount, or empty. Document it if the download files include it|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|*— `PersoonReis` —*|||||
|`Doel`|Text|Purpose of the trip|Free text, detail varies from two words to a paragraph|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Bestemming`|Text|Destination|Free text combining city and country, e.g. "New York, Verenigde Staten"; no country codes|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Van`|Date|Departure date|Consistently YYYY-MM-DD. Values/format: YYYY-MM-DD.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`TotEnMet`|Date|Return date|Consistently YYYY-MM-DD Values/format: YYYY-MM-DD.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`BetaaldDoor`|Text|Who paid for the trip|Careful with different spelling. Filter before treating rows as third-party-funded travel|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|*— `PersoonLoopbaan` —*|||||
|`Functie`|Text|Position held earlier in the member's career|Historical context, not part of the integrity registers|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Werkgever`|Text|Employer||TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`OmschrijvingNl`|Text|Dutch description of the role||TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`OmschrijvingEn`|Text|English description of the role||TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Plaats`|Text|Location of the employer||TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Van / TotEnMet`|Text|Start and end of the position||TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|*— `PersoonOnderwijs` —*|||||
|`OpleidingNl`|Text|Programme followed, Dutch|Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`OpleidingEn`|Text|Programme followed, English|Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Instelling`|Text|Educational institution|Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Plaats`|Text|Location of the institution|Personal data.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|*— `CommissieZetelVastPersoon` —*|||||
|`Functie`|Categorical|Role on the committee seat|Values include Voorzitter, Lid, Plv. lid; the platform shows only seats where TotEnMet is null Values/format: Voorzitter; Lid; Plv. lid;|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`Van / TotEnMet`|Date|Period of the committee seat|A null TotEnMet marks a current seat Values/format: ISO 8601 with offset.|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|`CommissieZetel.Commissie.NaamWebNL`|Text|Committee name|Nested three levels deep; substitute seats are in the parallel `CommissieZetelVervangerPersoon` list|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|
|*— `FractieZetelPersoon` —*|||||
|`FractieZetel.Fractie`|Text|Parliamentary group of the member|Nested object. This, not `Fractielabel`, is the working group field. Group changes are visible through Van/TotEnMet|TK Gegevensmagazijn - Odata API - https://opendata.tweedekamer.nl/|





2\. Eerste Kamer — side activities, gifts and foreign travel

===

## 2.1 Primary table

|||
|-|-|
|**Dataset:**|Eerste Kamer members — side activities, gifts and foreign travel (*Eerste Kamerleden: nevenfuncties, giften en reizen*)|
|**Source:**|Eerste Kamer der Staten-Generaal — register of side activities, register of gifts and register of foreign travel kept by the Griffie and published on https://www.eerstekamer.nl/begrip/integriteit.|
|**Description:**|The data contains, for every sitting member of the Senate: the positions they hold alongside their seat — including their main occupation, since the Senate is a part-time chamber. Whether those positions are paid and whether they involve advisory work, gifts worth more than €50, and the foreign trips they made at the invitation and expense of third parties. Committee memberships are included so that interests can be compared with the policy areas a senator works on. The data is scraped from the Senate's webpage and edited into a machine-readable format by TI-NL.|
|**Related legislation:**|Gedragscode integriteit Eerste Kamer (adopted 21 May 2019), art. 4 (foreign travel), art. 5 (gifts above €50), art. 6 (publication of positions held alongside membership and relevant interests); Reglement van Orde van de Eerste Kamer, chapter on integrity; Wet vergoedingen leden Eerste Kamer (statutory obligation to make positions public) (https://wetten.overheid.nl/BWBR0007402/2026-07-07).|
|**Period covered:**|2019–2023|
|**Geographical scope**|National|
|**Notes/Limitations**|Self-declared data with no formal sanction for incomplete or incorrect registration; TI-NL research in 2023 found senators with unregistered or wrongly registered positions. Remuneration is recorded as a yes/no indicator, **not as an amount**, so outside income cannot be quantified for senators. Advisory work is flagged by a separate indicator, which is relevant for lobbying risk but is applied by the member's own judgement. Free-text fields are not standardised. Always verify findings against the original register.|
|**Update frequency**|Every parliamentary cycle.|
|**Download link**|https://github.com/chiragjaiswar0814/IntegrityWatch|

## 

## 2.2 Secondary table (variables)

|Variable Name|Data Type|Variable Description|Notes/Limitations|Source|
|-|-|-|-|-|
|*— `root` —*|||||
|`id`|Text|Slug identifying the senator, taken from the source URL|Stable primary key within this dataset; also encodes the party, e.g. `...\_d66` Personal data.|eerstekamer.nl|
|`name`|Text|Name of the senator with titles|e.g. "mr. drs. W.J.M. Aerdts"; no separate surname or initials fields Personal data.|eerstekamer.nl|
|`name\_page`|Text|Name as printed on the page, including the party in brackets|Contains irregular double spaces; the party must be parsed out of this or out of `id` Personal data.|eerstekamer.nl|
|`url`|Text|URL of the senator's official page|The scraped source for each record|eerstekamer.nl|
|`hasPhoto`|Boolean|Whether a portrait was downloaded|Real boolean. Values/format: true; false.|Derived by TI-NL|
|`committees`|Text|Senate committees the senator sits on|Flat array of strings with the abbreviation in brackets, e.g. "Financiën (FIN)".|eerstekamer.nl|
|*— `Anciënniteit` —*|||||
|`extraInfo`|Text|Length of service as a sentence|Array of strings such as "132 dagen" and "(13 juni 2023 tot heden)"; not a numeric field|eerstekamer.nl|
|*— `Personalia` —*|||||
|`extraInfo`|Text|Birth place and date as a sentence|e.g. "geboren te Ermelo, 21 april 1983" — one unparsed string, not separate fields Personal data.|eerstekamer.nl|
|`woonplaats`|Text|Municipality and province of residence|Personal data.|eerstekamer.nl|
|`kinderen`|Text|Number of children|Personal data.|eerstekamer.nl|
|*— `Functies\_naast\_het\_Eerste\_Kamerlidmaatschap` —*|||||
|`title`|Text|Position title with the start and end date appended in Dutch prose|The date must be parsed out of this string; 9 items are strings with no structure|eerstekamer.nl|
|`beschrijving`|Text|Description of the organisation or the role|often describes the organisation rather than the senator's involvement|eerstekamer.nl|
|`bezoldigd`|Categorical|Whether the position is remunerated|No amount is available anywhere Values/format: ja; nee.|eerstekamer.nl|
|`advieswerk`|Categorical|Whether the position involves advisory work|String "ja" or "nee". Self-classified, so interpretation differs between senators. Relevant to lobbying risk Values/format: ja; nee.|Compiled by TI-NL|
|`sector`|Text|Sector of the organisation||eerstekamer.nl|
|`toelichting`|Text|Additional explanation||eerstekamer.nl|
|`<section>`|Categorical|Whether the position is current or ended|Values/format: actueel; afgesloten.|eerstekamer.nl|
|*— `Geschenken` —*|||||
|`title`|Text|Description of the gift with the date in prose|e.g. "Verjaardagsgeschenk, 2 december 2020". 61 gift items across 19 members|eerstekamer.nl|
|`betaald door`|Text|Who gave the gift|Free text, not standardised|eerstekamer.nl|
|`waarde`|Text|Value of the gift|Free text, not numeric.|eerstekamer.nl|
|`content (string form)`|Text|Sentence stating that no gifts were received||eerstekamer.nl|
|*— `Reizen` —*|||||
|`title`|Text|Destination with the travel period in prose|e.g. "Europees Parlement vanaf 10 januari 2023 tot 11 januari 2023".|eerstekamer.nl|
|`doel`|Text|Purpose of the trip|Free text, often a single word such as "werkbezoek"|eerstekamer.nl|
|`bekostiger`|Text|Who paid for the trip|Free text; partial funding appears as prose, e.g. "(deels)Europees parlement". No amounts|eerstekamer.nl|
|`content (string form)`|Text|Sentence stating that no trips were made||eerstekamer.nl|
|*— `Partijpolitieke\_functies` —*|||||
|`title / beschrijving / bezoldigd / advieswerk`|Text|Roles held within the senator's own party|Same item shape as the side-activities block, split into `actueel` and `afgesloten`.|eerstekamer.nl|
|*— `Loopbaan` —*|||||
|`functies`|Text|Previous career positions|Personal data.|eerstekamer.nl|
|*— `Opleidingen` —*|||||
|`<section>`|Text|Education, grouped by level|Plain text. Personal data.|eerstekamer.nl|
|*— `Onderscheidingen / Publicaties / Hobby's` —*|||||
|`content`|Text|Honours, publications and hobbies|Personal data.|eerstekamer.nl|

\---

# 

# 3\. Donations to political parties

## 3.1 Primary table

|||
|-|-|
|**Dataset:**|Donations to political parties and their affiliated institutions (*Giften aan politieke partijen en neveninstellingen*), 2017–2025|
|**Source:**|Ministerie van Binnenlandse Zaken en Koninkrijksrelaties / Rijksoverheid.nl — annual overviews of substantial donations to political parties and their affiliated institutions (https://www.rijksoverheid.nl/themas/overheid-en-democratie/democratie/rol-politieke-partijen/giften-en-subsidies-politieke-partijen or see the new dashboard: https://partijfinanciering.nl), which are based on the financial statements parties submit under the Wfpp. Compiled, merged and enriched across years by TI-NL.|
|**Description:**|Who gives money to Dutch political parties, how much, in which year and to which party. Each row is one reported donation or the annual total from one donor to one recipient. TI-NL adds two pieces of context that the government publication does not present as data: whether the donor is a sitting member of the Tweede Kamer, and, for donations from legal persons, the ultimate beneficial owner behind the donating entity.|
|**Related legislation:**|Wet financiering politieke partijen (Wfpp), in force since May 2013 — https://wetten.overheid.nl/BWBR0033004; as amended by the Evaluatiewet Wfpp, in force 1 January 2023, which lowered the publication threshold from €4,500 to €1,000 per donor per year, capped anonymous donations at €250, banned donations from abroad (except from Dutch voters living abroad), capped donations at €100,000 per donor per year, required donations of €10,000 or more to be reported within three days, and required parties to report the ultimate beneficial owner behind donations from legal persons. There is a new law being drafted: the law on political parties.|
|**Period covered:**|2017–2025|
|**Geographical scope**|National (donations to national parties and their affiliated institutions; donations to local and regional branches are not covered)|
|**Notes/Limitations**|**There is a break in the series.** For donations up to and including 2022 only donations above €4,500 per donor per year had to be published, from 2023 the threshold is €1,000. Year-on-year comparisons of donor numbers and totals are therefore not like-for-like. Donations above 10.000 euro, which need to be declared immediately, we have included one iteration. <br />Donations below the threshold, and anonymous donations up to the legal limit, are not provided in the dataset by the ministry.<br /><br />Membership fees, in-kind contributions and loans are treated differently from donations under the Wfpp and are not comparable. The reported figures come from party financial statements and are not independently audited by TI-NL. Totals for the SP are structurally high because the party requires its elected representatives and office holders at every level to transfer part of their salary to the party; the platform offers a filter to exclude sitting Tweede Kamer members for this reason. Donor names are free text and the same donor may appear under several spellings, so aggregation by donor requires manual matching. **Donor names and addresses are personal data** — see the note on personal data at the end of this document.Always verify findings against the original register.|
|**Update frequency**|Annually|
|**Download link**|https://github.com/chiragjaiswar0814/IntegrityWatch|

## 

## 3.2 Secondary table (variables)

|Variable Name|Data Type|Variable Description|Notes/Limitations|Source|
|-|-|-|-|-|
|*— `donations` —*|||||
|`name\_donor`|Text|Name of the individual or legal person making the donation|Simple text provided by the ministry.Personal data.|Ministry of the Interior overview, compiled by TI-NL|
|`address`|Text|Address of the donor as reported by the party|Granularity is inconsistent — some rows hold only a municipality. Contains embedded newlines in the 2024 file. Empty in certain rows. Personal data.|Ministry of the Interior overview, compiled by TI-NL|
|`amount\_total`|Text|Total donated by this donor to this recipient in this year, in euros|Contains "Onbekend" and "-", mixes `35000` and `35000.00`. Amounts appear only above the legal threshold — €4,500 up to 2022, €1,000 from 2023. Values/format: EUR.|Ministry of the Interior overview, compiled by TI-NL|
|`year`|Text|Calendar year in which the donation was received|Reporting year, not an exact date Values/format: YYYY.|Ministry of the Interior overview, compiled by TI-NL|
|`recipient\_name`|Text|Party or affiliated institution receiving the donation|The series contains the placeholder "Politieke partij". Naming is inconsistent between years. Use `political\_affiliation` for grouping|Ministry of the Interior overview, compiled by TI-NL|
|`political\_affiliation`|Categorical|Party the recipient belongs to|This is the recipient's party, not the donor's. It is an open categorical value.|Derived by TI-NL|
|*— `donations\_2024` —*|||||
|`ubo`|Text|Ultimate beneficial owner behind a donating legal person|Free-text names, sometimes several in one cell separated by newlines. Required under the Wfpp only from 2023, so absent by design for earlier years and for natural persons. Personal data|Party reporting under the Wfpp, compiled by TI-NL|
|*— `donations\_mps\_names` —*|||||
|`name`|Text|Name of a sitting Tweede Kamer member.|Variable exists to distinguish third party donations and interparty donations.  Initial-plus-surname format, e.g. "A. Aartsen", with no identifiers.|Compiled by TI-NL|
|*— `derived` —*|||||
|`mp`|Boolean|Whether the donor matched the MP names list|Computed in the browser and used by the "Zonder Tweedekamerleden" filter. Document it explicitly if it enters a published download Values/format: true; false. Personal data.|Derived by platform code|

\---

# 

4\. Public agendas of ministers and state secretaries

===

## 4.1 Primary table

|||
|-|-|
|**Dataset:**|Public agendas of members of government (*Openbare agenda's bewindspersonen*), 2017–2026|
|**Source:**|Rijksoverheid.nl — public agendas of ministers and state secretaries (https://www.rijksoverheid.nl/actueel/agenda). Collected and structured by TI-NL.|
|**Description:**|Which meetings, visits and other appointments members of government have made public, who they met, on which date and where. Because the Netherlands has no lobby register that records meetings, this dataset is the closest available proxy for who has access to ministers. Appointments can be filtered by ministry and by type, and searched by the name of an organisation.|
|**Related legislation:**|Publication rests on the Code of Conduct for ministers and state secretaries (link: https://www.rijksoverheid.nl/documenten/2023/02/20/gedragscode-voor-bewindspersonen). Rules are further expanded in the Uitvoeringsrichtlijn Openbare agenda bewindslieden, applied since the start of the Rutte III cabinet in October 2017 and expanded in June 2023. The guiding principle is "public, unless", exceptions taken from the Wet open overheid (Woo).|
|**Period covered:**|2017–2026|
|**Geographical scope**|National|
|**Notes/Limitations**|Only appointments the ministries choose to publish are included, and each minister remains responsible for the completeness of their own agenda. Internal meetings, party-political consultations, private appointments and appointments falling under Woo exception grounds are excluded by the guideline itself. Some ministers publish afterwards rather than in advance, so recent weeks may look emptier than they are. The counterpart to the meeting is contained in free-text fields rather than in a structured "organisation" field, so identifying who was met requires text search and manual cleaning. There is no policy dossier or subject taxonomy.|
|**Update frequency**|Annually|
|**Download link**|https://github.com/chiragjaiswar0814/IntegrityWatch|

## 

## 4.2 Secondary table (variables)

|Variable Name|Data Type|Variable Description|Notes/Limitations|Source|
|-|-|-|-|-|
|*— `agendas` —*|||||
|`activiteitnaam`|Text|Title of the appointment as published by the ministry|Present in all records. The counterpart organisation is normally inside this string, not in a field of its own|Rijksoverheid.nl|
|`bewindspersoon`|Text|Minister or state secretary holding the appointment|Array of plain-text names. Personal data.|Rijksoverheid.nl|
|`datum`|Date|Date the appointment took place||Rijksoverheid.nl|
|`type`|Categorical|Type of activity||Rijksoverheid.nl|
|`locatie`|Text|Location of the appointment|Often a city only, "via communicatietechnologie", or empty.|Rijksoverheid.nl|
|`subtitel`|Text|Short description of the appointment|Plain-text summary, frequently empty.|Rijksoverheid.nl|
|`subtitel\_full`|Text|Full description of the appointment|Raw HTML, including links, CSS classes and embedded media.|Rijksoverheid.nl|
|`url`|Text|Relative path of the appointment page on rijksoverheid.nl||Rijksoverheid.nl|
|*— `ministries\_matching` —*|||||
|`person`|Text|Name of the member of government||Compiled by TI-NL|
|`role`|Categorical|Whether the person is a minister or state secretary||Compiled by TI-NL|
|`ministry`|Text|Ministry the person belongs to|The source of the platform's ministry filter. Caution that ministry names change between cabinets.|Compiled by TI-NL|
|`start\_date / end\_date`|Text|Term of office|DD-MM-YYYY|Compiled by TI-NL|



