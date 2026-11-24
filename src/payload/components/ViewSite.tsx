/* A link to the public website in the admin's top bar. */
export default function ViewSite() {
  return (
    <a className="mlc-view-site" href="/" target="_blank" rel="noopener noreferrer">
      View website <span aria-hidden="true">↗</span>
    </a>
  );
}
