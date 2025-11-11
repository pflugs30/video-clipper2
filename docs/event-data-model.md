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
| ----------------- | ------------ | -------- | -------------------------------------------- |
| `date`            | `Date`       | Yes      | The date when the event occurred             |
| `gender`          | `Gender`     | Yes      | Gender classification of the event           |
| `ageLevel`        | `AgeLevel`   | Yes      | Age/competition level classification         |
| `sport`           | `Sport`      | Yes      | Type of sport (defaults to basketball)       |
| `eventName`       | `string`     | No       | Descriptive name for the event               |
| `location`        | `string`     | No       | Physical location or venue of the event      |
| `homeTeam`        | `string`     | No       | Name of the home team                        |
| `awayTeam`        | `string`     | No       | Name of the away team                        |
| `officiatingCrew` | `Official[]` | Yes      | Array of officials working the event         |
| `videoLink`       | `string`     | No       | URL/hyperlink to the video recording         |
| `notes`           | `string`     | No       | Additional notes or comments about the event |
| `createdOn`       | `Date`       | Yes      | Timestamp when the event record was created  |
| `modifiedOn`      | `Date`       | Yes      | Timestamp of the last modification           |

### Official

Represents an official (referee, umpire, etc.) working an event.

| Property   | Type     | Required | Description                                              |
| ---------- | -------- | -------- | -------------------------------------------------------- |
| `name`     | `string` | Yes      | Full name of the official                                |
| `position` | `string` | No       | Position or role (e.g., "Referee", "Umpire", "R1", "R2") |

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

1. **Date:** Must not be in the future (unless scheduling future events)
2. **Teams:** Home and away teams should be different (when both are provided)
3. **Video Link:** Must be a valid URL format (when provided)
4. **Officiating Crew:** At least one official should be specified
5. **Timestamps:** `modifiedOn` must be >= `createdOn`
6. **Optional Fields:** When provided, `eventName`, `location`, `homeTeam`, `awayTeam`, and `videoLink` must not be empty strings

---

## Change History

| Date       | Version | Changes                                                          |
| ---------- | ------- | ---------------------------------------------------------------- |
| 2025-11-11 | 1.1     | Made eventName, location, homeTeam, awayTeam, videoLink optional |
| 2025-11-11 | 1.0     | Initial data model definition                                    |

