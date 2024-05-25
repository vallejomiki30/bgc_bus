import asyncHandler from 'express-async-handler'

const getTestData = asyncHandler(async (req, res) => {
    const data = {"test": "test_data"}
    if (data) {
        res.status(200).json(data)
    }
    else {
        res.status(400)
        throw new Error('Something went wrong')
    }
})

// const postTestData = asyncHandler(async (req, res) => {
//     const reqBody = await req.json()
//     const values = reqBody.values
//     console.log(values)
// })

export {
    getTestData,
}