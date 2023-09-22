# Notes on Generative AI task

## Cypress

I don't know Cypress. I decided I wanted better reports,
because I couldn't see a summary when running all tests interactively.
I asked ChatGPT which pointed me at mochawesome. It told me how to configure
it in a cypress.json file. When I told it I only had a cypress.config.js file
it told me how to use that. However, I didn't get it generating reports,
so I gave up and ran on the command line to get a summary of passes and fails.

## Change the GET endpoint.

ChatGPT told me how to add an optional boolean parameter.
I changed it slightly to default to null not false.

I asked ChatGPT how to filter a list of Java objects based on a property called "completed".
It gave me an example.

## Add new GET endpoint to obtain a task by uuid.

I asked ChatGPT how to add the new endpoint and got a useful answer.
Implemented without asking any more questions, until I wanted to use Lombok
for a @Value class (to represent the body of the bad UUID response). I asked
how to add Lombok to a Gradle project and how to set builder defaults on the properties,
and got useful answers. Then when it didn't work it told me how to enable
Lombok in IntelliJ - I didn't have the plugin since I recently installed
Community Edition having lost access to Ultimate.

ChatGPT told me how to set up a global exception handler and how to
get the request path in the exception handler method. Which were probably the
first coding questions I asked it that I didn't already know the answer to
(though I knew in general what I needed to do).

## Add a new PUT endpoint to mark a task as complete.

I got ChatGPT to remind me how to debug an application run with bootRun.
I could easily have looked it up. The actual problem was that I hadn't
put "/competed" in the path.

## Add a new POST endpoint to create a new task and add it to the list of tasks.

Asked ChatGPT how to set the response status for @PostMapping to 201.
Answer - use @ResponseStatus.


