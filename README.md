FEATURES - 
    1. DISPLAY QUESTION & RESPONSE CAN BE (CONFIGURABLE BY ADMIN)
        - YES OR NO
        - RATING SCALE (1-5)
        - TEXT FIELD (OPTIONAL or Required)
    
    2. SUBMIT BUTTON
        - ON CLICK WOULD SHOW (THANK YOU MSG AND HIDE POPUP)
    

TECHNICAL POV - 
    1. CREATE POPUP FORM HAVING ROLES
        - IF ROLE == ADMIN: [
                [
                    ...
                    { 
                        QUESTION TEXT, 
                        RAIDO BUTTON :  WHATEVER SELECTED PREVIOUSLY
                        TEXT FIELD : TEXTAREA
                        UN-PUBLISH - BUTTON
                    }
                ],
                { 
                    QUESTION TEXT : { ADD, EDIT, DELETE }, 
                    RAIDO BUTTON :  { { YES/NO, RATING SCALE } }
                    TEXT FIELD : TEXTAREA (OPTIONAL)
                    PUBLISH - BUTTON
                }
            ]
        - ELSE:
            {
                [
                   { 
                        QUESTION TEXT, 
                        RAIDO BUTTON : FROM ADMIN
                        TEXT FIELD : TEXTAREA (OPTIONAL)
                    } 
                ]
                {
                    SUBMIT: BUTTON
                }
            }
    
    2. API ENDPOINTS 
        1. /submit (POST) FROM USER
            {
                questionID: 123,
                radioBtn: True,
                ratingScale: 3,
                textField: "some feedback",
                userId: "123-456-789"
            }
        2. /getFeedbackQuestions (GET) 