import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { EDIT_PROFILE } from "./actionTypes";
import { profileSuccess, profileError } from "./actions";
//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeProfile,
  postJwtProfile,
} from "../../../helpers/fakebackend_helper";
import API from "../../../helpers/API";
import apiAuth from "../../../helpers/ApiAuth";
import NotificationManager from "../../../components/Common/NotificationManager";

const fireBaseBackend = getFirebaseBackend();

var updatedProfileData = null;

// .then((response) => {
//   console.log(response.data);
//   if (response.status === 200) {
//     NotificationManager.success(
//       "",
//       `Member Updated Successfully`,
//       3000,
//       null,
//       null,
//       ""
//     );
//     props.closeAddPopup();
//   } else {
//     NotificationManager.error(
//       "",
//       `Member Update Error`,
//       3000,
//       null,
//       null,
//       ""
//     );
//   }
// })
// .catch((error) => {
//   NotificationManager.error(
//     "",
//     `Member Update Error`,
//     3000,
//     null,
//     null,
//     ""
//   );
// });

const UpdateProfile = async (user) => {
  await apiAuth
    .put(`/api/user/${user.idx}`, user)
    .then((response) => {
      updatedProfileData = response;
      if (response.status === 200) {
        NotificationManager.success(
          "",
          `Profile Updated Successfully`,
          3000,
          null,
          null,
          ""
        );
      } else {
        NotificationManager.error(
          "",
          `Profile Update Error`,
          3000,
          null,
          null,
          ""
        );
      }
    })
    .catch((error) => {
      NotificationManager.error(
        "",
        `Profile Update Error`,
        3000,
        null,
        null,
        ""
      );
    });
};

function* editProfile({ payload: { user } }) {
  try {
    const response = yield call(UpdateProfile, user);
    if (updatedProfileData) {
      yield put(profileSuccess(updatedProfileData));
      updatedProfileData = null;
    }
  } catch (error) {
    yield put(profileError(error));
  }
}
export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile);
}

function* ProfileSaga() {
  yield all([fork(watchProfile)]);
}

export default ProfileSaga;
