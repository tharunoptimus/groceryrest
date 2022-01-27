<%@page import="java.util.Base64"%>
<%@page import="java.security.SecureRandom"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="java.sql.PreparedStatement"%>
<%@page import="java.sql.DriverManager"%>
<%@page import="java.sql.Connection"%>
<%@page import="org.json.JSONObject"%>
<%@page import="java.util.stream.Collectors"%>
<%!
    public static String requestData = "";
    public static JSONObject json = new JSONObject();

    public class User {

        public String token = "";
        public String name = "";
        public String username = "";
        public String profilePic = "";
        public String list = "";
        public boolean status = false;

        User(String token, String name, String username, String profilePic, String list) {
            this.token = token;
            this.name = name;
            this.username = username;
            this.profilePic = profilePic;
            this.list = list;
        }

        User() {
        }
    }

    public class CheckUser extends User {

        public boolean status = false;

        CheckUser(User user) {
            this.token = user.token;
            this.name = user.name;
            this.username = user.username;
            this.profilePic = user.profilePic;
            this.list = user.list;
        }

        CheckUser() {
        }
    }

    public static void setJSONValues(HttpServletRequest request) {
        try {
            requestData = request.getReader().lines()
                    .collect(Collectors.joining());
            json = new JSONObject(requestData.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public User login(String username, String password) {
        User user = new User();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/grocery", "root", "");
            PreparedStatement stmt = con.prepareStatement("SELECT * FROM users WHERE username = ? AND password = ?", ResultSet.TYPE_SCROLL_SENSITIVE,
                    ResultSet.CONCUR_UPDATABLE);
            stmt.setString(1, username);
            stmt.setString(2, password);
            ResultSet result = stmt.executeQuery();
            result.first();

            user = new User(result.getString("token"),
                    result.getString("name"),
                    result.getString("username"),
                    result.getString("profilePic"),
                    result.getString("list"));

        } catch (Exception e) {
            System.out.println(e);
        }
        return user;
    }

    public boolean doesUsernameExist(String username) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/grocery", "root", "");
            PreparedStatement stmt = con.prepareStatement("SELECT * FROM users WHERE username = ?", ResultSet.TYPE_SCROLL_SENSITIVE,
                    ResultSet.CONCUR_UPDATABLE);
            stmt.setString(1, username);
            ResultSet result = stmt.executeQuery();

            if (result.next()) {
                return false;
            }

        } catch (Exception e) {
            System.out.println(e);
        }

        return true;
    }

    public static String generateString() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[16];
        random.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    public User register(String name, String username, String password) {

        if (!doesUsernameExist(username)) {
            return new User();
        }

        User user = new User();

        String createdToken = generateString();
        String profilePic = new String("https://avatars.dicebear.com/api/male/" + name + ".svg?mood[]=happy&mood[]=sad");

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/grocery", "root", "");
            PreparedStatement stmt = con.prepareStatement("INSERT INTO users(token, name,username, password, profilePic) VALUES(?, ?, ?, ?, ?)");
            stmt.setString(1, createdToken);
            stmt.setString(2, name);
            stmt.setString(3, username);
            stmt.setString(4, password);
            stmt.setString(5, profilePic);
            stmt.executeUpdate();

            user = new User(createdToken, name, username, profilePic, "");

        } catch (Exception e) {
            System.out.println(e);
        }
        return user;
    }

    public void updateList(String token, String list) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/grocery", "root", "");
            PreparedStatement stmt = con.prepareStatement("UPDATE users SET list = ? WHERE token = ?");
            stmt.setString(1, list);
            stmt.setString(2, token);
            stmt.executeUpdate();
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public String getReqBody(String key) {
        String value = json.getString(key);
        return value;
    }
%>