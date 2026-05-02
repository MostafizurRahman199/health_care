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


---------------------Create Doctor----------
API : http://localhost:3000/api/v1/user/create-doctor
Form-data : 
Response : {
    "success": true,
    "message": "Doctor created successfully",
    "data": {
        "id": "f8bc0e5f-e81f-4122-bc1c-5e145aed3a21",
        "name": "John Doe",
        "email": "doctor@gmail.com",
        "profilePhoto": "https://res.cloudinary.com/dysbo7q3f/image/upload/v1777698386/health-care/doctors/zupcjgf17dqiitsiqx3c.jpg",
        "contactNumber": "01712345678",
        "address": "Dhaka",
        "registrationNumber": "REG-2026-XYZ",
        "experienceYears": 5,
        "gender": "MALE",
        "appintmentFee": 500,
        "qualification": "MBBS, FCPS",
        "cureentWorkingPlcae": "Dhaka Medical College",
        "designation": "Senior Consultant",
        "specialization": "Cardiology",
        "isDeleted": false,
        "createdAt": "2026-05-02T05:06:26.920Z",
        "updatedAt": "2026-05-02T05:06:26.920Z",
        "user": {
            "id": "fa9fa92f-cec9-4bd2-b8df-e04a2ce82889",
            "email": "doctor@gmail.com",
            "password": "$2b$12$Ma9Piw9LhaphTmPU8GNTs.FLYO6XsKhSzTFwoV4vOKqpGiSkO7gmy",
            "role": "DOCTOR",
            "needPasswordChange": true,
            "status": "ACTIVE",
            "createdAt": "2026-05-02T05:06:26.914Z",
            "updatedAt": "2026-05-02T05:06:26.914Z"
        }
    }
}


---------------------------Create Admin------------------------
API : http://localhost:3000/api/v1/user/create-admin
Form-data : 
Response : {
    "success": true,
    "message": "Admin created successfully",
    "data": {
        "id": "3f7fdfed-ba46-4504-90ff-a177d7f0823d",
        "name": "Super Admin",
        "email": "admin@gmail.com",
        "profilePhoto": "https://res.cloudinary.com/dysbo7q3f/image/upload/v1777698717/health-care/admins/zlmcmf7eaxnddbzy785p.png",
        "contactNumber": "01712345678",
        "isDeleted": false,
        "createdAt": "2026-05-02T05:11:57.883Z",
        "updatedAt": "2026-05-02T05:11:57.883Z",
        "user": {
            "id": "ea242899-613f-42cd-8101-2799af7c1548",
            "email": "admin@gmail.com",
            "password": "$2b$12$YkfvvLFuYVhlV3xqUMgpNuB0je3EgswxZIHZ/KRwq5P702On0JAD6",
            "role": "ADMIN",
            "needPasswordChange": true,
            "status": "ACTIVE",
            "createdAt": "2026-05-02T05:11:57.879Z",
            "updatedAt": "2026-05-02T05:11:57.879Z"
        }
    }
}