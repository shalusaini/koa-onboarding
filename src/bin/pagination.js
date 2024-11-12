/**
 *
 */
async function pagination (
  collection,
  page,
  limit,
  searchQuery = {},
  sortBy = false
) {
  skip = (page - 1) * limit
  //Perform the query with pagination and search
  const result = await collection
    .find(searchQuery)
    .sort({ createdAt: sortBy ? -1 : 1 })
    .skip(skip)
    .limit(limit)
    .toArray()
  return result
}

// Aggregate pagination
async function paginationAggregate (
  collection,
  page,
  limit,
  searchQuery,
  locationQuery,
  mapView,
  type = false,
  search = ''
) {
  // Calculate the number of documents to skip
  const skip = (page - 1) * limit
  // Aggregation pipeline for pagination and search
  const pipeline = [
    ...locationQuery,
    ...(searchQuery ? [{ $match: searchQuery }] : []), // Match documents that meet the search criteria
    ...(!mapView ? [{ $skip: skip }] : []), // Skip the specified number of documents
    ...(!mapView ? [{ $limit: limit }] : []), // Limit the number of documents returned
    ...(search.length > 1 && ['city', 'zip'].includes(type) // Sort by city and zip according to new requirement(Ankita).
      ? [{ $sort: { [`${type}` === 'city' ? 'zip' : 'city']: 1 } }]
      : [])
  ]
  // Perform the aggregation
  const result = await collection.aggregate(pipeline).toArray()
  return result
}
// descending order sorting
async function paginationSorting (collection, page, limit, searchQuery = {}) {
  skip = (page - 1) * limit
  //Perform the query with pagination and search
  const result = await collection
    .find(searchQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray()
  return result
}

module.exports = { pagination, paginationAggregate, paginationSorting }
