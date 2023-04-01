import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

/**
 * Define the schema
 */
const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true },     // The name of the exercise
    reps: { type: Number, required: true },     // The number of times the exercise was performed
    weight: { type: Number, required: true },   // The weight of the weights used for the exercise
    unit: { type: String, required: true},      // The unit of measurement of the weight. Only values allowed are kgs and lbs
    date: { type: String, required: true}       // The date the exercise was performed. Specified as MM-DD-YY, e.g., 07-30-21.
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Exercise = mongoose.model("Exercise", exerciseSchema);

// Create an exercise
const createExercise = async (name, reps, weight, unit, date) => {
    const exercise = Exercise({ name: name, reps: reps, weight: weight, unit: unit, date: date }); // Call the constructor to create an instance of the model class Exercise
    return exercise.save(); // Call save to persist this object as a document in MongoDB
}

// Retrieve all exercises
const findExercises = async() => {
    const query = Exercise.find()
    return query.exec();
}

// Find the exercise with the given ID
const findExerciseById = async(_id) => {
    const query = Exercise.findById({_id: _id});
    return query.exec();
}

// Replace the name, reps, weight, unit, date properties of the exercise with the ID provided
const replaceExercise = async(_id, name, reps, weight, unit, date) => {
    const result = await Exercise.replaceOne({ _id: _id}, { name: name, reps: reps, weight: weight, unit: unit, date: date });
    return result.modifiedCount;
}

// Delete exercises
const deleteExercises = async(_id) => {
    const result = await Exercise.deleteOne({ _id: _id});
    return result.deletedCount;
}

export {createExercise, findExercises, findExerciseById, replaceExercise, deleteExercises}