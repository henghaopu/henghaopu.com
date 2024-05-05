export async function loader() {
  // TODO: Query the database and services for the health of the system
  return new Response('OK');
}
