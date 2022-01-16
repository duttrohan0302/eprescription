
# EPRESCRIPTION SYSTEM
#### Backend Code for Eprescription System

### Running the App
#### Create a config folder with a index.js file with the following content
module.exports = {
    mongoURI: "Enter your mongodb URI here,
    secretOrKey: "Enter the unique secretOrKey for JWT" 
}
Now, in the backend directory, run 
##### npm install
Then run
##### npm run dev

=======
## Routes

### USER Routes

1. Create/Register User
  @type    POST
  @route   /register
  @desc    Register the user
  @access  Public

2. Login User
  @type    POST
  @route   /login
  @desc    Login the Registered user
  @access  Public

3. Get all Users  
  @type    GET
  @route   /users
  @desc    Get all users
  @access  Admin

4. Get Current user 
  @type    GET 
  @route   /users/current
  @desc    Get current user(from JWT and Passport Auth)
  @access  Private

5. Update Current user 
  @type    PATCH 
  @route   /users/:id
  @desc    Update user's details like name,email,phone
  @access  Private

6. Delete a User
  @type    DELETE
  @route   /users
  @desc    Delete a user
  @access  Private


### Patient Feature Routes

1. Create a prescription
  @type    POST
  @route   /prescription
  @desc    Create a prescription
  @access  Private

2. Get a single prescription
  @type    GET
  @route   /prescription//:prescriptionId
  @desc    Get prescription (from id)
  @access  Private

3. Get all prescriptions of a user  
  @type    GET
  @route   /prescriptions/:patientId
  @desc    get all prescriptions (using patient id)
  @access  Private

4. Give feedback
  @type    POST 
  @route   /feedback
  @desc    Give feedback of doctors to the admin
  @access  Private

5. Get a doctor's feedback
  @type    GET 
  @route   /feedbacks/:doctorId
  @desc    Get all feedbacks (using doctor's id)
  @access  Private

### Calendar Routes
1. Create a calendar
  @type    POST
  @route   /calendar
  @desc    Create a new calendar for the logged in user
  @access  Private

2. Get All calendars
  @type    GET
  @route   /calendar
  @desc    Get all calendars
  @access  Admin

3. Delete a calendar
  @type    DELETE
  @route   /calendar
  @desc    Delete a calendar
  @access  Private

4. Get calendar by slug
  @type    GET
  @route   /calendar/:slug
  @desc    Get calendar by slug
  @access  Private

### Event/Meetings Routes
#### Note - All meetings/appointments/events shall be referred to as events in the documentation as well as in the code base
1. Create a Event/Meetings
  @type    POST
  @route   /events
  @desc    Create a new Event/Meetings for the logged in user
  @access  Private
  @Requirements and Formating
    name        : string,
    description : string,
    startTime   : timeInJSON(IST) (e.g. yyyy-mm-ddThh:mm:ss)
    endTime     : timeInJSON(IST) (e.g. yyyy-mm-ddThh:mm:ss)
    recurringIn : Integer(0 means not recurring, (in days))

2. Get Events By Date
  @type    GET (send date as query parameter date,(if you want to get someone else's event, pass their slug in the params along with date))
  @route   /eventsByDate
  @desc    Get all the events occurring in a day in formatted form
  @access  Private

3. Get Events By Month
  @type    GET (send date as query parameter date, 1st date of the send date is considered as the month,(if you want to get someone else's event, pass their slug in the params along with date))
  @route   /eventsByMonth
  @desc    Get all the events occurring in a month in formatted form
  @access  Private
  
4. Delete Event by Event Id
  @type    DELETE
  @route   /events/:id
  @desc    If you want to delete only the current date out of the complete recurring event send deleteOneInRecurring = true(1) and send dates, otherwise complete event will be deleted.
  @access  Private

5. Update Event Details by Event Id
  @type    PATCH
  @route   /events/:id
  @desc    Send oldStartTime,oldEndTime,newStartTime,newEndTime if you want to change the time, and send name and description as per requirement 
  @access  Private

### Invitation Routes
#### Note - Event must be created first by a user than then other users can be invited using their email ids

1. Create an Invitation
  @type    POST
  @route   /invitation/:eventId
  @desc    Create an invitation from logged in user to other users
  @access  Private
  @Requirements and Formating
  * First, create an event, then pass the eventId as params to this api request
    emails        : comma separated emails

2. Get logged in user's invitation
  @type    GET
  @route   /invitations
  @desc    Get all the invitations of the logged in user
  @access  Private

3. Accept an invitation
  @type   GET
  @route  /invitation/accept/:id
  @desc   Accept an invitation by passing its id as params, also creates an event in the user's calendar and notifies if the slot is not empty
  @access Private

4. Reject an invitation
  @type   GET
  @route  /invitation/reject/:id
  @desc   Reject an invitation by passing its id as params(can also send rejection message along with it)
  @access Private

5. Suggest something in an invitation
  @type   POST
  @route  /invitation/suggest/:id
  @desc   Send a suggestionMessage in the body
  @access Private

6. See all sent invitations
  @type   GET
  @route  /invitations/sent
  @desc   See all your sent invitations and also their status
  @access Private
