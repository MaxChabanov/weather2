export const getNavigation = function () {
  return new Promise((resolve) => {
    navigator.geolocation.watchPosition(
      function () {
        let userPosition = {};
        navigator.geolocation.getCurrentPosition((position) => {
          userPosition.lat = position.coords.latitude;
          userPosition.lon = position.coords.longitude;
          resolve(userPosition);
        });
        return userPosition;
      },
      function (error) {
        if (error.code == error.PERMISSION_DENIED)
          alert(
            "Sorry, you denied the permission to get your position. We can't show the weather in your country."
          );
      }
    );
  });
};
