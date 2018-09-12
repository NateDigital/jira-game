interface JiraRule {
  name?: string
  type?: string
  pointMultiplier: number
  jql: (username: string) => string
}

interface Rules {
  issues: JiraRule[]
}

// Ticket Statuses / Lifecycle
const toDoIssues = `(Reopened, "Ready for Dev", Parked, Backlog, "To Do", Verified, "Needs Info", "Analysis Complete", "Bus Case Required", "Bus Case Ready", "Development Backlog", Archived, Analysis, "Needs Analysis", "Next up")`
const inProgressIssues = `("In Progress", "Development in Progress", "Development WIP", "In Development")`
const inReviewIssues = `("Developer Review", "Ready for Review", "In Review", "Defect Review", Review, "Review Done", "Code Review", "For Review")`
const inTestingIssues = `("Testing in Progress", Testing, "Testing WIP", "Pending Testing", "Pending Verification", "Problem Verified", "Waiting for Testing", "In Testing", "Testing/Review")`
const readyForRealeaseIssues = `("Ready for Production", "Ready for Release", "Waiting for Release", "Ready To Publish")`
const doneIssues = `(Resolved, Closed, "Release Complete", Done, Released, Live, "Pilot In Progress")`

// Issue Types (issuetype in *)
const isBug = `(Bug, Defect, "Project Bug", "Defect Sub Task")`

// 
// Other
// const currentSprint = `during ("2018/08/01 12:00", "2018/08/23 12:00")`
// const currentSprint = 'issuetype in (standardIssueTypes(), subTaskIssueTypes())'
const openSprints = `sprint IN openSprints()`
const currentSprint = `sprint IN openSprints() AND sprint NOT IN futureSprints()`
//const exceptions = `AND resolution NOT IN ("Won't Do", Duplicate, "Won't Fix") `
const exceptions = ``

// get sprint start date, then;
//  during ("2017/02/09 12:00", "2017/02/23 12:00")  

const rules: Rules = {
  issues: [
    { 
      name: 'Found a Bug & Created an issue',
      type: 'found-bug',
      pointMultiplier: 36,
      jql: username => `${currentSprint} AND issuetype IN ${isBug} AND reporter IN ("${username}") ${exceptions}`
    },
    { 
      name: 'Reported an issue',
      type: 'issue-creation',
      pointMultiplier: 5,
      jql: username => `${currentSprint} AND reporter IN ("${username}") ${exceptions}`
    }, 

    // querying on Reported and Created fields SEEM to give same results
    // { 
    //   name: 'Created an issue',
    //   type: 'issue-creation',
    //   pointMultiplier: 5,
    //   jql: username => `${currentSprint} AND creator IN ("${username}") ${exceptions}`
    // }, 
    
    { 
      name: 'Participated in an issue',
      type: 'issue-participation',
      pointMultiplier: 10,
      jql: username => `${currentSprint} AND watcher IN ("${username}") ${exceptions}`
    }, 

    // { 
    //   pointMultiplier: 109999,
    //   jql: username => `${currentSprint} AND participants IN ("${username}") ${exceptions}`
    // }, 

    // Commented on an issue
    // { 
    //   pointMultiplier: 109999,
    //   jql: username => `${currentSprint} AND commented("by ${username}") ${exceptions}`
    // }, 
    { 
      name: 'Mentioned in a comment',
      type: 'issue-participation',
      pointMultiplier: 1,
      jql: username => `${currentSprint} AND comment ~ "${username}" ${exceptions}`
    }, 

    { 
      name: 'Moved from TODO to In Progress',
      type: 'transition',
      pointMultiplier: 9,
      jql: username => `${currentSprint} AND status CHANGED FROM ${toDoIssues} TO ${inProgressIssues} BY "${username}" ${exceptions}`
    }, 

    // Assigned when is in the Done column
    { 
      name: 'Assigned when ticket status is Done',
      pointMultiplier: 7,
      type: 'assignment',
      jql: username => `status IN ${doneIssues} AND ${currentSprint} AND assignee in ("${username}") ${exceptions}`
    }, 

    

    // Completed Development / Moved to In-Review
    { 
      name: 'Moved From in-Progress to In Review',
      type: 'transition',
      pointMultiplier: 29,
      jql: username => `${currentSprint} AND status CHANGED FROM ${inProgressIssues} TO ${inReviewIssues} BY "${username}" ${exceptions}`
    }, 
    { 
      name: 'Moved From TODO to In Review',
      type: 'transition',
      pointMultiplier: 12,
      jql: username => `${currentSprint} AND status CHANGED FROM ${toDoIssues} TO ${inReviewIssues} BY "${username}" ${exceptions}`
    }, 


    // Dev Completed Review / Moved to Test
    { 
      name: 'Moved From In-Review to Test',
      type: 'transition',
      pointMultiplier: 16,
      jql: username => `${currentSprint} AND status CHANGED FROM ${inReviewIssues} TO ${inTestingIssues} BY "${username}" ${exceptions}`
    }, 
    { 
      name: 'Moved From In Progress to Test',
      type: 'transition',
      pointMultiplier: 12,
      jql: username => `${currentSprint} AND status CHANGED FROM ${inProgressIssues} TO ${inTestingIssues} BY "${username}" ${exceptions}`
    }, 
    { 
      name: 'Moved From TODO to Test',
      type: 'transition',
      pointMultiplier: 5,
      jql: username => `${currentSprint} AND status CHANGED FROM ${toDoIssues} TO ${inTestingIssues} BY "${username}" ${exceptions}`
    }, 


    // Tester Completed Testing / Moved to Release
    { 
      name: 'Moved From In Testing to Ready For Release',
      type: 'transition',
      pointMultiplier: 30,
      jql: username => `${currentSprint} AND status CHANGED FROM ${inTestingIssues} TO ${readyForRealeaseIssues} BY "${username}" ${exceptions}`
    }, 
    { 
      name: 'Moved From Review to Ready For Release',
      type: 'transition',
      pointMultiplier: 18,
      jql: username => `${currentSprint} AND status CHANGED FROM ${inReviewIssues} TO ${readyForRealeaseIssues} BY "${username}" ${exceptions}`
    }, 
    { 
      name: 'Moved From In Progress to Ready For Release',
      type: 'transition',
      pointMultiplier: 12,
      jql: username => `${currentSprint} AND status CHANGED FROM ${inProgressIssues} TO ${readyForRealeaseIssues} BY "${username}" ${exceptions}`
    }, 
    { 
      name: 'Moved From TODO to Ready For Release',
      type: 'transition',
      pointMultiplier: 10,
      jql: username => `${currentSprint} AND status CHANGED FROM ${toDoIssues} TO ${readyForRealeaseIssues} BY "${username}" ${exceptions}`
    }, 

    // Released a ticket to production / Moved to Done
    { 
      name: 'Moved From Ready For Release to Done',
      pointMultiplier: 30,
      type: 'transition',
      jql: username => `${currentSprint} AND status CHANGED FROM ${readyForRealeaseIssues} TO ${doneIssues} BY "${username}" ${exceptions}`
    },
    { 
      name: 'Moved From In Testing to Done',
      pointMultiplier: 25,
      type: 'transition',
      jql: username => `${currentSprint} AND status CHANGED FROM ${inTestingIssues} TO ${doneIssues} BY "${username}" ${exceptions}`
    },
    { 
      name: 'Moved From In Review to Done',
      pointMultiplier: 20,
      type: 'transition',
      jql: username => `${currentSprint} AND status CHANGED FROM ${inReviewIssues} TO ${doneIssues} BY "${username}" ${exceptions}`
    },
    { 
      name: 'Moved From In Progress to Done',
      pointMultiplier: 15,
      type: 'transition',
      jql: username => `${currentSprint} AND status CHANGED FROM ${inProgressIssues} TO ${doneIssues} BY "${username}" ${exceptions}`
    },
    { 
      name: 'Moved From TODO to Done',
      pointMultiplier: 10,
      type: 'transition',
      jql: username => `${currentSprint} AND status CHANGED FROM ${toDoIssues} TO ${doneIssues} BY "${username}" ${exceptions}`
    },

  ]
}

export default rules
