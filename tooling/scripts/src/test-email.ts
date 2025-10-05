import { sendEmail, verifyConnection } from "@betterlms/email";

async function testEmail() {
	console.log("📧 Testing Email Service...\n");

	try {
		// First, verify SMTP connection
		console.log("🔍 Verifying SMTP connection...");
		await verifyConnection();
		console.log("✅ SMTP connection verified!\n");

		// Test email 1
		console.log("📤 Sending test email to me@indrazm.com...");
		await sendEmail({
			to: "me@indrazm.com",
			subject: "Test Email from BetterLMS",
			text: "This is a test email from the BetterLMS platform. If you receive this, the email service is working correctly!",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h1 style="color: #2563eb;">🎉 Email Service Test</h1>
					<p>Hello!</p>
					<p>This is a <strong>test email</strong> from the BetterLMS platform.</p>
					<p>If you're reading this, it means our email service is working correctly!</p>
					<hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
					<p style="color: #6b7280; font-size: 14px;">
						Sent from BetterLMS Email Service<br />
						Powered by nodemailer
					</p>
				</div>
			`,
		});
		console.log("✅ Email sent to me@indrazm.com\n");

		// Test email 2
		console.log("📤 Sending test email to indrazulfi@gmal.com...");
		await sendEmail({
			to: "indrazulfi@gmal.com",
			subject: "Test Email from BetterLMS",
			text: "This is a test email from the BetterLMS platform. If you receive this, the email service is working correctly!",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h1 style="color: #2563eb;">🎉 Email Service Test</h1>
					<p>Hello!</p>
					<p>This is a <strong>test email</strong> from the BetterLMS platform.</p>
					<p>If you're reading this, it means our email service is working correctly!</p>
					<hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
					<p style="color: #6b7280; font-size: 14px;">
						Sent from BetterLMS Email Service<br />
						Powered by nodemailer
					</p>
				</div>
			`,
		});
		console.log("✅ Email sent to indrazulfi@gmal.com\n");

		// Test email with multiple recipients
		console.log("📤 Sending test email to both addresses at once...");
		await sendEmail({
			to: ["me@indrazm.com", "indrazulfi@gmal.com"],
			subject: "BetterLMS - Multi-Recipient Test",
			text: "This test email was sent to multiple recipients at once!",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h1 style="color: #16a34a;">✅ Multi-Recipient Test</h1>
					<p>Hello!</p>
					<p>This email was sent to <strong>multiple recipients</strong> at once.</p>
					<p>This demonstrates that our email service can handle multiple recipients correctly.</p>
					<hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
					<p style="color: #6b7280; font-size: 14px;">
						Sent from BetterLMS Email Service<br />
						Testing multi-recipient functionality
					</p>
				</div>
			`,
		});
		console.log("✅ Email sent to both recipients\n");

		console.log("🎉 All test emails sent successfully!");
		console.log("📬 Please check your inbox at:");
		console.log("   - me@indrazm.com");
		console.log("   - indrazulfi@gmal.com");
	} catch (error) {
		console.error("❌ Error sending test emails:", error);
		process.exit(1);
	}
}

testEmail();
