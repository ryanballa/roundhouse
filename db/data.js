module.exports = {
  locomotives: [
    {
      "road": "BN",
      "location": "home",
      "is_operational": true,
  	  "user_id": 1
    },
    {
      "road": "Frisco",
      "location": "studio",
      "is_operational": true,
  	  "user_id": 1
    },
    {
      "road": "Santa Fe",
      "location": "studio",
      "is_operational": true,
  	  "user_id": 2
    }
  ],
  photos: [
    {
      path: 'foo',
    },
    {
      path: 'bar',
    },
  ],
  railcars: [
    {
      "car_number": 123,
      "road": "BN",
  	  "location": "home",
  	  "user_id": 1
    },
    {
      "car_number": 456,
      "road": "Frisco",
  	  "location": "studio",
  	  "user_id": 1
    },
    {
      "car_number": 789,
      "road": "Santa Fe",
  	  "location": "studio",
  	  "user_id": 2
    }
  ],
  users: [
    {
      "username": "rballa",
      "password": "$2a$10$hw3NVHwIdoSe89qQj6frROpbvIfmJNfrK5xRdbpXqa0j23q3xrkeu"
    },
    {
      "username": "second",
      "password": "$2a$10$hw3NVHwIdoSe89qQj6frROpbvIfmJNfrK5xRdbpXqa0j23q3xrkeu"
    }
  ]
};
