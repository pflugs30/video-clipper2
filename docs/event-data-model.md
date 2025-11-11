# Event Data Model

## Overview

The Event data model represents a real-world sporting event (game, match, or contest) that is being recorded and clipped. Each project in the video clipper application corresponds to an Event with specific metadata and attributes.

## Purpose

This data model enables:
- Tracking event-specific metadata for organization and searchability
- Associating video clips with specific games and teams
- Managing officiating crew information
- Maintaining event history with creation and modification timestamps

---

## Data Structures

### Event

Represents a sporting event with all associated metadata.

| Property          | Type         | Required | Description                                  |
| ----------------- | ------------ | :------: | -------------------------------------------- |
| `date`            | `Date`       |   Yes    | The date when the event occurred             |
| `gender`          | `Gender`     |   Yes    | Gender classification of the event           |
| `ageLevel`        | `AgeLevel`   |   Yes    | Age/competition level classification         |
| `sport`           | `Sport`      |   Yes    | Type of sport (defaults to basketball)       |
| `eventName`       | `string`     |    No    | Descriptive name for the event               |
| `location`        | `string`     |    No    | Physical location or venue of the event      |
| `homeTeam`        | `string`     |    No    | Name of the home team                        |
| `awayTeam`        | `string`     |    No    | Name of the away team                        |
| `officiatingCrew` | `Official[]` |   Yes    | Array of officials working the event         |
| `videoLink`       | `string`     |    No    | URL/hyperlink to the video recording         |
| `notes`           | `string`     |    No    | Additional notes or comments about the event |
| `createdOn`       | `Date`       |   Yes    | Timestamp when the event record was created  |
| `modifiedOn`      | `Date`       |   Yes    | Timestamp of the last modification           |

### Official

Represents an official (referee, umpire, etc.) working an event.

| Property   | Type     | Required | Description                                        |
| ---------- | -------- | :------: | -------------------------------------------------- |
| `name`     | `string` |   Yes    | Full name of the official                          |
| `position` | `string` |    No    | Position or role (e.g., "Referee", "Umpire", etc.) |

### Call

Represents an official's call or decision made during an event.

| Property         | Type           | Required | Description                               |
| ---------------- | -------------- | :------: | ----------------------------------------- |
| `id`             | `number`       |   Yes    | Unique identifier for the call            |
| `callName`       | `string`       |   Yes    | Name of the call                          |
| `callCategoryId` | `CallCategory` |   Yes    | Category classification (Foul, Violation) |

### Clip

Represents a video clip segment extracted from an event recording. Each clip has defined start and end times and can be exported or reviewed independently.

| Property                     | Type      | Required | Description                                                           |
| ---------------------------- | --------- | :------: | --------------------------------------------------------------------- |
| `id`                         | `string`  |   Yes    | Unique identifier for the clip                                        |
| `name`                       | `string`  |   Yes    | Descriptive name for the clip                                         |
| `inSeconds`                  | `number`  |   Yes    | Start time of the clip in seconds from video beginning                |
| `outSeconds`                 | `number`  |   Yes    | End time of the clip in seconds from video beginning                  |
| `clipIndexNumber`            | `number`  |    No    | Clip's index number within an Event (helps with sorting)              |
| `period`                     | `string`  |    No    | Event period during which the clip takes place                        |
| `clockTime`                  | `string`  |    No    | Time on the game clock when the clip takes place                      |
| `call`                       | `Call`    |    No    | The official's call or decision object                                |
| `officialPosition`           | `string`  |    No    | Position where the official was when the call was made                |
| `officialName`               | `string`  |    No    | Name of the official who made (or should have made) the call          |
| `callType`                   | `string`  |    No    | Whether this was a call or non-call situation                         |
| `wasShooting`                | `boolean` |    No    | Whether this was a shooting situation                                 |
| `wasMultipleWhistles`        | `boolean` |    No    | Whether multiple officials sounded their whistle                      |
| `wasCorrectDecision`         | `string`  |    No    | Whether the official(s) made the correct decision                     |
| `wasCorrectOfficialPosition` | `string`  |    No    | Whether the official was in the correct or best position for the call |
| `shouldReview`               | `boolean` |    No    | Whether the officiating crew should review this call                  |
| `description`                | `string`  |    No    | Detailed summary of the clip                                          |
| `tags`                       | `string`  |    No    | Series of tags annotating the clip                                    |
| `comments`                   | `string`  |    No    | User-provided comments about the clip                                 |
| `createdOn`                  | `Date`    |    No    | Timestamp when the clip was created                                   |
| `modifiedOn`                 | `Date`    |    No    | Timestamp when the clip was last modified                             |

---

## Enumerations

### Gender

Classifies the gender category of the event participants.

**Values:**
- `boys` - Male participants
- `girls` - Female participants
- `coed` - Mixed/coeducational participants

### AgeLevel

Classifies the age or competition level of the event.

**Values:**
- `JV` - Junior Varsity
- `Varsity` - Varsity
- `NCAA Div 3` - NCAA Division 3
- *(Additional levels to be added as needed)*

### Sport

Classifies the type of sport being played.

**Values:**
- `basketball` - Basketball (default)
- `football` - Football
- `volleyball` - Volleyball
- *(Additional sports to be added as needed)*

### CallCategory

Classifies the type of official's call or decision.

**Values:**
- `Foul` - Foul calls (personal fouls, technical fouls, etc.)
- `Violation` - Violation calls (traveling, double dribble, etc.)
- `Miscellaneous` - Miscellaneous calls and decisions

---

## Usage Examples

### Creating a New Event

```typescript
const event: Event = {
  date: new Date('2025-11-15'),
  gender: Gender.Boys,
  ageLevel: AgeLevel.Varsity,
  sport: Sport.Basketball,
  eventName: 'Regional Championship',
  location: 'Central High School Gymnasium',
  homeTeam: 'Central Eagles',
  awayTeam: 'North Wildcats',
  officiatingCrew: [
    { name: 'John Smith', position: 'Referee' },
    { name: 'Jane Doe', position: 'Umpire 1' },
    { name: 'Bob Johnson', position: 'Umpire 2' }
  ],
  videoLink: 'https://example.com/video/game123',
  notes: 'Overtime game with controversial call in final minute',
  createdOn: new Date(),
  modifiedOn: new Date()
};
```

### Creating a Clip

```typescript
const clip: Clip = {
  id: 'clip_abc123',
  name: 'Questionable Travel Call - Q3 4:32',
  inSeconds: 342.5,
  outSeconds: 348.2,
  period: '3rd Quarter',
  clockTime: '4:32',
  call: {
    id: 5,
    callName: 'Traveling',
    callCategoryId: CallCategory.Violation
  },
  officialName: 'John Smith',
  officialPosition: 'Lead'
};
```

### Creating a Call

```typescript
const call: Call = {
  id: 1,
  callName: 'Blocking Foul',
  callCategoryId: CallCategory.Foul
};
```

### Working with Multiple Clips

```typescript
const clips: Clip[] = [
  {
    id: 'clip_001',
    name: 'Opening Tip-off',
    inSeconds: 0,
    outSeconds: 5.3
  },
  {
    id: 'clip_002',
    name: 'Three-point shot attempt',
    inSeconds: 125.8,
    outSeconds: 132.4
  },
  {
    id: 'clip_003',
    name: 'Blocking foul discussion',
    inSeconds: 445.2,
    outSeconds: 458.9
  }
];
```

---

## Future Considerations

### Potential Enhancements

1. **Additional Age Levels:** NCAA Div 1, NCAA Div 2, High School, Middle School, Professional
2. **Additional Sports:** Soccer, Baseball, Softball, Wrestling, etc.
3. **Score Tracking:** Final score and period-by-period scoring
4. **Weather Conditions:** For outdoor events
5. **Attendance:** Number of spectators
6. **Event Status:** Scheduled, In Progress, Completed, Cancelled
7. **Official Certification:** Track certification levels and organizations
8. **Team Records:** Season records at time of game
9. **Conference/League:** Organizational classification
10. **Playoff Information:** Round, seed numbers, etc.

### Integration Points

- **Projects:** Link Event data to existing Project structure
- **Clips:** Associate clips with specific event phases (period/quarter, time)
- **Export:** Include event metadata in exported clip data
- **Search/Filter:** Enable searching and filtering clips by event attributes

---

## Validation Rules

### Event Validation

1. **Date:** Must not be in the future (unless scheduling future events)
2. **Teams:** Home and away teams should be different (when both are provided)
3. **Video Link:** Must be a valid URL format (when provided)
4. **Officiating Crew:** At least one official should be specified
5. **Timestamps:** `modifiedOn` must be >= `createdOn`
6. **Optional Fields:** When provided, `eventName`, `location`, `homeTeam`, `awayTeam`, and `videoLink` must not be empty strings

### Clip Validation

1. **ID:** Must be unique within the project/event
2. **Name:** Must not be an empty string
3. **Time Range:** `inSeconds` must be less than `outSeconds`
4. **Time Values:** Both `inSeconds` and `outSeconds` must be non-negative
5. **Duration:** Clip duration (`outSeconds` - `inSeconds`) should be greater than 0
6. **Optional String Fields:** When provided, string fields (`period`, `clockTime`, `officialPosition`, `officialName`, `callType`, `wasCorrectDecision`, `wasCorrectOfficialPosition`) must not be empty strings
7. **Optional Number Fields:** When provided, `clipIndexNumber` must be a valid number
8. **Optional Boolean Fields:** When provided, `wasShooting`, `wasMultipleWhistles`, and `shouldReview` must be boolean values
9. **Optional Date Fields:** When provided, `createdOn` and `modifiedOn` must be valid Date objects
10. **Call Object:** When provided, must be a valid Call object with all required fields

### Call Validation

1. **ID:** Must be a valid number
2. **Call Name:** Must not be an empty string
3. **Call Category:** Must be a valid CallCategory enum value (Foul, Violation, or Miscellaneous)

---

## Change History

| Date       | Version | Changes                                                                  |
| ---------- | ------- | ------------------------------------------------------------------------ |
| 2025-11-11 | 1.5     | Removed `eventId` from Clip (use other methods to link clips to events)  |
| 2025-11-11 | 1.4     | Changed `callId` from number to Call object; added Call and CallCategory |
| 2025-11-11 | 1.3     | Added 18 optional fields to Clip from Access database migration          |
| 2025-11-11 | 1.2     | Added Clip data structure and documentation                              |
| 2025-11-11 | 1.1     | Made eventName, location, homeTeam, awayTeam, videoLink optional         |
| 2025-11-11 | 1.0     | Initial data model definition                                            |

