THIS PROJECT IS DEPRECATED

This project started in September 2019. It was originally designed as a tool to manage my collection of locomotives and railcars for insurance claims - hopefully never needed. I could have used an off-the-shelf project but I wanted to build my own application to stay current with development patterns and practices. 

Soon afterwards I realized our model railroad club would need a tool to generate work orders. We were using an inadequate spreadsheet before. Work orders are paper documents that simulate an engineer's duties for the day on a real railroad. I had to expand the tool greatly. As I did this I cut corners to speed up development. This meant I often duplicated code resulting in way too many components. I also put off learning GraphQL even though it would have been a great fit for this project. This resulted in an API that is too difficult to manage and does not accomplish what I need.

After working with the data for over a year and seeing where I could improve, I'm ready to start a new project. RoundhouseV2 will also be a Node/React app. However, I will use GraphQL for the data model and instead of rolling my own authentication I will use an off the shelf solution. I will also spend more time on this project compared to Roundhouse V1 as that project works and can be used in the meantime. I will commit to 80% unit test code coverage and use Typescript on everything possible.

I also plan on making this solution more of a collaborative effort by asking other model railroad clubs what kind of software they might need to run their clubs. I can’t guarantee I’ll have time to build it but I’ll see what I can do.

# Roundhouse

This app is used to manage one's inventory of model railroad locomotives, railcars, and generate work orders for realistic operations sessions. 

## Requirements

* Node
* Yarn
* PostgreSQL
