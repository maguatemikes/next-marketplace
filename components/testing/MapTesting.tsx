export default async function MapTesting({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the promise to get the actual data
  const filters = await searchParams;

  // This will log to your terminal/console
  console.log("Current Page:", filters.page); // Output: "1"
  console.log("Current Category:", filters.category); // Output: "Cafes"

  return (
    <div>
      <h1>Category: {filters.category}</h1>
      <p>Page: {filters.page}</p>
    </div>
  );
}
