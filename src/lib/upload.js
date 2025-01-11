const upload = async (file) => {
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/djekh3agv/image/upload'; // Cloudinary URL with your Cloud Name
    const formData = new FormData();
  
    // Ensure the file is selected
    if (!file) {
      return Promise.reject('No file selected');
    }
  
    // Append the file and the upload preset
    formData.append('file', file);
    formData.append('upload_preset', 'profile_preset'); // Using the unsigned upload preset
  
    return new Promise((resolve, reject) => {
      fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to upload image. Please check the file and try again.');
          }
          return response.json();
        })
        .then((data) => {
          if (data.secure_url) {
            resolve(data.secure_url); // Return the secure URL of the uploaded image
          } else {
            reject('Cloudinary did not return a valid URL');
          }
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
          reject(`Error uploading image: ${error.message || error}`);
        });
    });
  };
  
  export default upload;
  