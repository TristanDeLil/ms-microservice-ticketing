
# Microservices - Ticketing

```bash
docker compose -f config/ticketing-howestprime-dev/docker-compose.yml up -d --remove-orphans
```

## Infrastructure

### 📘 MongoDB Aggregation Query 

#### Explanation for fetching Orders that contains tickets with full movie information

This MongoDb query is used to retrieve a specific **order by its ID** from a MongoDB collection, enrich it with related **movie data**, and structure the result into a clean, domain-specific format.


#### Query

```ts

        const pipeline = [
            {
                $match: { id: orderId },
            },

            {
                $unwind: {
                    path: '$items',
                    preserveNullAndEmptyArrays: true, // Prevents failure if items is empty
                },
            },

            {
                $lookup: {
                    from: 'movies', // The name of the movies collection
                    localField: 'items.movieId',
                    foreignField: 'id',
                    as: 'movieData',
                },
            },
            {
                $unwind: {
                    path: '$movieData',
                    preserveNullAndEmptyArrays: true, // Prevents failure if no matching movie is found
                },
            },

            {
                $group: {
                    _id: '$id',
                    id: { $first: '$id' },
                    customer: { $first: '$customer' },
                    items: {
                        $push: {
                            price: '$items.price',
                            seat: '$items.seat',
                            date: '$items.date',

                            movie: {
                                id: '$movieData.id',
                                title: '$movieData.title',
                                duration: '$movieData.duration',
                                poster: '$movieData.poster',
                                genres: '$movieData.genres',
                            },
                        },
                    },
                    price: { $first: '$price' },
                },
            },
            {
                $project: {
                    _id: 0, // Exclude MongoDB's internal _id field
                    status: 0,
                    paymentStatus: 0,
                    paymentId: 0,
                    bookingId: 0,
                },
            },
        ];

        const result = await this._collection.aggregate<YOURDATADTO>(pipeline)
            .toArray();
       
```
---



#### 🧪 Aggregation Pipeline Explained

```ts
const pipeline = [...]
```

The pipeline contains several MongoDB stages:

####### 1. `$match`

```js
{ $match: { id: orderId } }
```

- Filters the collection to only include the document with the given `orderId`.

####### 2. `$unwind` (items)

```js
{
    $unwind: {
        path: '$items',
        preserveNullAndEmptyArrays: true
    }
}
```

- Deconstructs the `items` array so each item becomes its own document.
- Preserves documents with no items (prevents errors).

####### 3. `$lookup` (join with `movies`)

```js
{
    $lookup: {
        from: 'movies',
        localField: 'items.movie',
        foreignField: 'id',
        as: 'movieData',
    }
}
```

- Joins each order item with its corresponding movie based on `movie.id`.

####### 4. `$unwind` (movieData)

```js
{
    $unwind: {
        path: '$movieData',
        preserveNullAndEmptyArrays: true
    }
}
```

- Flattens the `movieData` array to make fields accessible.
- Handles missing movies gracefully.

####### 5. `$group`

```js
{
    $group: {
        _id: '$id',
        id: { $first: '$id' },
        customer: { $first: '$customer' },
        items: {
            $push: {
                price: '$items.price',
                seat: '$items.seat',
                date: '$items.date',
                movie: {
                    id: '$movieData.id',
                    title: '$movieData.title',
                    duration: '$movieData.duration',
                    poster: '$movieData.poster',
                    genres: '$movieData.genres',
                },
            },
        },
        price: { $first: '$price' },
    }
}
```

- Regroups the data back into a single order document.
- Builds a clean list of enriched items.

####### 6. `$project`

```js
{
    $project: {
        _id: 0,
        status: 0,
        paymentStatus: 0,
        paymentId: 0,
        bookingId: 0,
    }
}
```

- Removes fields that are not needed in the final output.

---

#### ✅ Result Handling

```ts
const result = await this._collection.aggregate<YOURDATADTO>(pipeline)
            .toArray();       
```

- Executes the pipeline.


---
