------------------------------- Create Patient  -------------------------------

API : http://localhost:3000/api/v1/user/create-patient
form-data : name, email, password, contactNumber, address, profilePhoto(File type)
Response : {
    "success": true,
    "message": "Patient created successfully",
    "data": {
        "id": "83e329ab-3321-4fec-9abf-458ff6e5f012",
        "name": "John Doe",
        "email": "john@example123.com",
        "profilePhoto": "https://res.cloudinary.com/dysbo7q3f/image/upload/v1777484840/health-care/patients/uzpfozlxrmtoawgapael.jpg",
        "contactNumber": "01712345678",
        "address": "Dhaka",
        "isDeleted": false,
        "createdAt": "2026-04-29T17:47:18.004Z",
        "updatedAt": "2026-04-29T17:47:18.004Z",
        "user": {
            "id": "559bf4ec-b94b-4846-a4a8-e8ae02ce8626",
            "email": "john@example123.com",
            "password": "$2b$12$GBns5XHZozbyra6vI65Fu.SuRGmUYsecLHHnY2KKfMHtA.YiUMHJS",
            "role": "PATIENT",
            "needPasswordChange": true,
            "status": "ACTIVE",
            "createdAt": "2026-04-29T17:47:17.998Z",
            "updatedAt": "2026-04-29T17:47:17.998Z"
        }
    }
}