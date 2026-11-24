/* A short guide above the Placements and Published papers lists for adding
   many entries at once from a spreadsheet. */

type Column = [name: string, what: string];

function ImportHelp({ template, columns, note }: { template: string; columns: Column[]; note?: string }) {
  return (
    <details className="mlc-import-help">
      <summary>
        <span className="mlc-import-help__title">Adding lots at once?</span> Import them from a spreadsheet
      </summary>
      <ol className="mlc-import-help__steps">
        <li>
          <a href={template} download>
            Download the template
          </a>{' '}
          and open it in Google Sheets or Excel.
        </li>
        <li>Fill in one row per entry, then save or download it as CSV.</li>
        <li>
          Click the <strong>⋮</strong> button next to Filters, choose <strong>Import</strong>, upload the file, check the
          preview, then press <strong>Start Import</strong>.
        </li>
      </ol>
      <table className="mlc-import-help__columns">
        <tbody>
          {columns.map(([name, what]) => (
            <tr key={name}>
              <th scope="row">
                <code>{name}</code>
              </th>
              <td>{what}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {note && <p className="mlc-import-help__note">{note}</p>}
    </details>
  );
}

export function PlacementsImportHelp() {
  return (
    <ImportHelp
      template="/templates/placements.csv"
      columns={[
        ['person', 'Their name. Required.'],
        ['type', 'Internship, Grad school, Fellowship or Programme. Required.'],
        ['title', 'What it is, for example “MSc, Artificial Intelligence”. Optional.'],
        ['organisation', 'The university, company or programme. Required.'],
        ['city', 'For the map, for example “Lausanne”. Optional.'],
        ['country', 'Needed when there’s a city, for example “Switzerland”.'],
        ['year', 'The year it starts, 2022 up to next year. Required.'],
      ]}
      note="New cities are found and added to the map by themselves, which takes about a second each, so a big file can take a minute. Rows with a mistake are skipped and listed so you can fix them."
    />
  );
}

export function PapersImportHelp() {
  return (
    <ImportHelp
      template="/templates/papers.csv"
      columns={[
        ['title', 'Required.'],
        ['authors', 'In the order they appear on the paper. Required.'],
        ['venue', 'Where it appeared, for example “AfricaNLP workshop, ACL 2026”. Required.'],
        ['year', 'Required.'],
        ['topic', 'For example NLP, Speech, Vision, Health. Required.'],
        ['summary', 'Two to four plain sentences. Optional.'],
        ['abstract', 'Optional.'],
        ['links_paper, links_code, links_slides, links_recording', 'Full links starting with https://. Optional.'],
        ['featured', '“yes” to show it on the homepage. Optional.'],
      ]}
      note="Figures can’t come from a spreadsheet; add those to each paper afterwards."
    />
  );
}
