# hyper63 ETL Job Template

This is a template project for creating an ETL Job.

You can create a new ETL job from this template by running the following
command:

```
npx bam github:hyper63/etl-template [your-jobname]
```

This will create a new directory based on your jobname

Then you will want to cd into the directory and open `app.arc` in your
editor. You will want to modify the name of the app.

```
@app
[your-jobname]

@scheduled
etl
  rate 1 day
  src src

```

> NOTE: It is very important to change the name of your app, also change the rate of your scheduled ETL Job in this file if different than daily.

## Setting up Environment Variables

This tempate is setup to leverage environment variables for the job specialized configuration information.

```
SOURCE_URL
SOURCE_TOKEN
TARGET_URL
TARGET_TOKEN
```

There may be more config params based on the source endpoint you need to specify. Using the `arc env` cli command you can set these variables in aws.

```
arc env production KEY value
```

## Project Structure

```
- src
  - lib
    index.js - ETL Pipeline Details
    index_test.js - Pipeline Test
    utils.js - Async Utils
    get-data.js - example source/extract function
    put-stats.js - example target/load function
  index.js - main handler for scheduled events
  package.json - manifest file
  config.arc - architect aws lambda config
README.md
app.arc - architect aws app config
```

## About the ETL Job Code 

The ETL Job is broken out into three distinct functions: Extract, Transform and Load. In the `lib/index.js` file you can see each function defined with some sample code for each. 

### Extract Function

The Extract function is responsible for getting all of the data from the source or sources. In this template, there is a `lib/get-data.js` that shows an example of how to get the data, this function takes an `object` and returns an `Async` which is like a promise but gets lazy loaded so that the caller can control when the async call will occur. You can `map` and `chain` on the `Async` object, if you map, the value you return will be placed in the `Async` and if you `chain` you must return a new `Async` object.

### Transform Function

The transform function takes `data` and then returns an `AsyncReader` which wraps around a value. The easiest way to work with the transform function is this pattern:

```
exports.transform = data => AsyncReader.of(
  ...do stuff..
)
```

Then you can map over the data an create any modifications or changes to the data you want.

### Load function

The load function is very similar to the extract function, you will get data as your argument and you will want to put each item in the data to the data warehouse. For the most part, if you are using `hyper63` as your data warehouse, you should not have to modify the load function, it should just work, as long as your data is ready to go and your target is properly setup.


## Testing

The easiest way to test in a development environment is with `fetch-mock`, which allows you to simulate exactly what the api servers will return back and it can allow your job to react to it. This allows you to focus on your code and your patterns.

This template has a test setup and ready to run, you can find it `lib/index_test.js`, if you look at the file, you can see that it has a fetchMock setup for two endpoints and the actual test routine should look very similar to the handler code that is getting invoked. You can use this test script to verify your code is properly running each step.

## Deployment

Now you have tested locally, you are ready to deploy, make sure you have the right region and profile set.

```
export AWS_PROFILE=default
export AWS_REGION=us-east-1
```

Then you will want to make sure you are in the project root directory.

```
cat app.arc
```

> NOTE: if you do not see the app.arc file you are not in the project root directory

Then run

```
arc deploy --production
```

## Monitoring

Now that you are up and running, you may want to check out your jobs progress or any errors that may be happening.

You can access the logs for your deployment

```
arc logs production src
```

## Misc

You can make changes and then deploy often, it will replace the existing jobs.

## Destroy Job

```
arc destroy --production --name your-jobname
```

This command will destroy the job from aws and remove all traces.


