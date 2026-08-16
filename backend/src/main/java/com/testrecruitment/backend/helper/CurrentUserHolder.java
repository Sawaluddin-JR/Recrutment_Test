package com.testrecruitment.backend.helper;

import com.testrecruitment.backend.model.Users;

public class CurrentUserHolder {
    private static final ThreadLocal<Users> currentUser = new ThreadLocal<>();

    public static void set(Users user) {
        currentUser.set(user);
    }

    public static Users get() {
        return currentUser.get();
    }

    public static void clear() {
        currentUser.remove();
    }
}
