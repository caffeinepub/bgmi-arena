import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public query ({ caller }) func getCallerUserProfile() : async ?{
    username : Text;
    bgmiUid : Text;
    avatar : Text;
  } {
    if (caller.isAnonymous()) {
      return null;
    };
    ?{
      username = "";
      bgmiUid = "";
      avatar = "";
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : {
    username : Text;
    bgmiUid : Text;
    avatar : Text;
  }) : async () {
    if (caller.isAnonymous()) {
      return;
    };
    ();
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?{
    username : Text;
    bgmiUid : Text;
    avatar : Text;
  } {
    if (caller.isAnonymous()) {
      return null;
    };
    ?{
      username = "";
      bgmiUid = "";
      avatar = "";
    };
  };
};
