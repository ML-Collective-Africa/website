/* Help text under the latitude and longitude fields on Map places. */
export default function CoordinatesHelp() {
  return (
    <p style={{ margin: '-8px 0 24px', fontSize: 13, lineHeight: 1.5, color: 'var(--theme-elevation-500)' }}>
      To find them, open the place in Google Maps, right-click the spot and click the numbers at the top of the menu to
      copy them. The first number is the latitude, the second the longitude.
    </p>
  );
}
