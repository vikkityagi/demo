package com.SendEmail;

import java.sql.Statement;
import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class SendMail {

    public static void main(String[] args) {
    	
    	try {
    		
    	  String url = "jdbc:postgresql://localhost:5432/postgres";
    	  String msg = "";
    	  int response = 0;
        	
          Connection c = DriverManager.getConnection(url,"postgres","postgres");
          Statement stmt = c.createStatement();
          ResultSet rs = stmt.executeQuery("select mobile_no,sms_content,is_processed,bodyattachment,cc,bcc from consumer_content");
          long mills = System.currentTimeMillis();
	      java.util.Date date = new java.util.Date(mills);
          while(rs.next()) {
        	  String isprocess = rs.getString("is_processed");
        	  if(!isprocess.equals("yes")) {
//        		  
        		  String smscontent = rs.getString("sms_content");
        		  String email = rs.getString("mobile_no");
        		  String to = email;
        		  String bodypart = rs.getString("bodyattachment");
        		  String cc = rs.getString("cc");
        		  String bcc = rs.getString("bcc");
        		  String from = "vikkityagi1998@gmail.com";
        		  String host = "smtp.gmail.com";
        		  Properties properties = System.getProperties();
        		  properties.put("mail.smtp.host", host);
        		  properties.put("mail.smtp.port", "465");
        		  properties.put("mail.smtp.ssl.enable", "true");
        		  properties.put("mail.smtp.auth", "true");
        		  
        		  Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
        			  
                      protected PasswordAuthentication getPasswordAuthentication() {
          
                          return new PasswordAuthentication("vikkityagi1998@gmail.com", "lslmvihwerrjltqu");
          
                      }
          
                  });
        		  
        		// Used to debug SMTP issues
        	        session.setDebug(true);

        	        try {
        	            // Create a default MimeMessage object.
        	            MimeMessage message = new MimeMessage(session);

        	            // Set From: header field of the header.
        	            message.setFrom(new InternetAddress(from));

        	            // Set To: header field of the header.
        	            try {
        	            	message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            	            message.addRecipient(Message.RecipientType.CC, new InternetAddress(cc));
            	            message.addRecipient(Message.RecipientType.BCC, new InternetAddress(bcc));

        	            }catch(Exception e) {
        	            	e.printStackTrace();
        	            	msg = e.toString();
        	            	response = 400;
        	            	String query = "update consumer_content set is_processed=(?),process_date_time=(?),response_data=(?),response_code=(?) where mobile_no=(?)";
                	        PreparedStatement pstmt = c.prepareStatement(query);
                	        
                	        pstmt.setString(1, "no");
                	        pstmt.setString(2, date.toString());
                	        pstmt.setString(3, msg);
                	        pstmt.setInt(4, response);
                	        pstmt.setString(5, email);
                	        pstmt.executeUpdate();
                	        System.exit(0);
        	            }
        	            

        	            // Set Subject: header field
        	            message.setSubject("This is the header!");

        	            
        	            
        	            Multipart multipart = new MimeMultipart();

        	            MimeBodyPart attachmentPart = new MimeBodyPart();

        	            MimeBodyPart textPart = new MimeBodyPart();

        	            try {

        	                File f =new File(bodypart);

        	                attachmentPart.attachFile(f);
        	                textPart.setText(date.toString());
        	                multipart.addBodyPart(textPart);
        	                multipart.addBodyPart(attachmentPart);

        	            } catch (IOException e) {
        	            	System.out.println("where emai is "+email);
        	            	e.printStackTrace();
        	            	msg=e.toString();
        	            	response = 400;
        	            	String query = "update consumer_content set is_processed=(?),process_date_time=(?),response_data=(?),response_code=(?) where mobile_no=(?)";
                	        PreparedStatement pstmt = c.prepareStatement(query);
                	        
                	        pstmt.setString(1, "no");
                	        pstmt.setString(2, date.toString());
                	        pstmt.setString(3, msg);
                	        pstmt.setInt(4, response);
                	        pstmt.setString(5, email);
                	        pstmt.executeUpdate();
        	                System.exit(0);

        	            }
        	            message.setContent(multipart);
        	            
        	            System.out.println("sending...");
        	            // Send message
        	            
        	            Transport.send(message, message.getAllRecipients());
        	            
        	            
        	            
        	            msg = "Sent message successfully....";
        	            response = 200; 
        	            
          
        		  
        	        }
        	        catch (MessagingException mex) {
        	        	msg = mex.toString();
        	        	response = 400;
        	        	String query = "update consumer_content set is_processed=(?),process_date_time=(?),response_data=(?),response_code=(?) where mobile_no=(?)";
            	        PreparedStatement pstmt = c.prepareStatement(query);
            	        
            	        pstmt.setString(1, "no");
            	        pstmt.setString(2, date.toString());
            	        pstmt.setString(3, msg);
            	        pstmt.setInt(4, response);
            	        pstmt.setString(5, email);
            	        pstmt.executeUpdate();
        	            mex.printStackTrace();
        	            System.exit(0);
        	        }
        	        String query = "update consumer_content set is_processed=(?),process_date_time=(?),response_data=(?),response_code=(?) where mobile_no=(?)";
        	        PreparedStatement pstmt = c.prepareStatement(query);
        	        
        	        pstmt.setString(1, "yes");
        	        pstmt.setString(2, date.toString());
        	        pstmt.setString(3, msg);
        	        pstmt.setInt(4, response);
        	        pstmt.setString(5, email);
        	        pstmt.executeUpdate();
        	        
        	        System.out.println();
        	        System.out.println();
        	        System.out.println();
        	  	}//end if loop
        	  } //end while loop
          }
          
          
          
  
          
          
  
            catch(Exception e) {
    		e.printStackTrace();
    		System.out.println(e);
    		System.exit(0);
    	}
    	
    	

    }

}
