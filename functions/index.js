// const functions = require("firebase-functions");
// const admin = require("firebase-admin");

// admin.initializeApp();

// const db = admin.firestore();
// const messaging = admin.messaging();

// /* ======================================================
//    1️⃣ NEW ORDER → Notify ALL providers
//    ====================================================== */
// exports.newOrderNotification = functions.database
//   .ref("/orders/{orderId}")
//   .onCreate(async (snapshot, context) => {
//     const order = snapshot.val();
//     if (!order) return null;

//     try {
//       const providerSnap = await db
//         .collection("users")
//         .where("role", "==", "provider")
//         .get();

//       const tokens = providerSnap.docs
//         .map(doc => doc.data()?.fcmToken)
//         .filter(Boolean);

//       if (!tokens.length) {
//         console.log("No provider tokens found.");
//         return null;
//       }

//       return messaging.sendEachForMulticast({
//         tokens,
//         notification: {
//           title: "New Order 🆕",
//           body: `New order for ${
//             order?.service?.title || "a service"
//           } is available!`,
//         },
//         data: {
//           orderId: context.params.orderId,
//           type: "NEW_ORDER",
//         },
//       });

//     } catch (error) {
//       console.error("Error sending new order notification:", error);
//       return null;
//     }
//   });

// /* ======================================================
//    2️⃣ ORDER UPDATES → Customer + Provider notifications
//    ====================================================== */
// exports.orderUpdateNotifications = functions.database
//   .ref("/orders/{orderId}")
//   .onUpdate(async (change, context) => {

//     const before = change.before.val() || {};
//     const after = change.after.val() || {};

//     if (!after) return null;

//     try {
//       const customerId = after.userId;
//       const providerId = after.providerId;

//       let customerToken = null;
//       let providerToken = null;
//       let providerName = "Provider";

//       /* ---------- FETCH CUSTOMER ---------- */
//       if (customerId) {
//         const customerSnap = await db
//           .collection("users")
//           .doc(customerId)
//           .get();

//         if (customerSnap.exists) {
//           customerToken = customerSnap.data()?.fcmToken;
//         }
//       }

//       /* ---------- FETCH PROVIDER ---------- */
//       if (providerId) {
//         const providerSnap = await db
//           .collection("users")
//           .doc(providerId)
//           .get();

//         if (providerSnap.exists) {
//           providerToken = providerSnap.data()?.fcmToken;
//           providerName = providerSnap.data()?.name || "Provider";
//         }
//       }

//       const serviceTitle =
//         after?.service?.title || "your service";

//       let payload = null;

//       /* ---------- CUSTOMER NOTIFICATIONS ---------- */

//       if (
//         before.status !== "ACCEPTED" &&
//         after.status === "ACCEPTED" &&
//         customerToken
//       ) {
//         payload = {
//           token: customerToken,
//           notification: {
//             title: "Order Accepted ✅",
//             body: `${providerName} accepted your order.`,
//           },
//           data: {
//             orderId: context.params.orderId,
//             type: "ORDER_ACCEPTED",
//           },
//         };
//       }

//       else if (
//         before.status !== "IN_PROGRESS" &&
//         after.status === "IN_PROGRESS" &&
//         customerToken
//       ) {
//         payload = {
//           token: customerToken,
//           notification: {
//             title: "Service Started 🧼",
//             body: `${serviceTitle} is now in progress.`,
//           },
//           data: {
//             orderId: context.params.orderId,
//             type: "SERVICE_STARTED",
//           },
//         };
//       }

//       else if (
//         before.status !== "COMPLETED" &&
//         after.status === "COMPLETED" &&
//         customerToken
//       ) {
//         payload = {
//           token: customerToken,
//           notification: {
//             title: "Service Completed 🎉",
//             body: `${serviceTitle} has been completed.`,
//           },
//           data: {
//             orderId: context.params.orderId,
//             type: "SERVICE_COMPLETED",
//           },
//         };
//       }

//       else if (
//         before.status !== "CANCELLED" &&
//         after.status === "CANCELLED" &&
//         customerToken
//       ) {
//         payload = {
//           token: customerToken,
//           notification: {
//             title: "Order Cancelled ❌",
//             body: `${serviceTitle} was cancelled.`,
//           },
//           data: {
//             orderId: context.params.orderId,
//             type: "ORDER_CANCELLED",
//           },
//         };
//       }

//       /* ---------- PROVIDER PAYMENT ---------- */

//       else if (
//         before.payment_status !== "PAID" &&
//         after.payment_status === "PAID" &&
//         providerToken
//       ) {
//         payload = {
//           token: providerToken,
//           notification: {
//             title: "Payment Received 💰",
//             body: "Customer has completed payment.",
//           },
//           data: {
//             orderId: context.params.orderId,
//             type: "PAYMENT_RECEIVED",
//           },
//         };
//       }

//       if (!payload) return null;

//       return messaging.send(payload);

//     } catch (error) {
//       console.error("Error sending update notification:", error);
//       return null;
//     }
//   });






const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();

// Firestore & Messaging references
const db = admin.firestore();
const messaging = admin.messaging();

// 🔹 Import Realtime Database triggers from v1 to fix functions.database.ref issue
const { database } = require("firebase-functions/v1");

/* ======================================================
   1️⃣ NEW ORDER → Notify ALL providers
   ====================================================== */
exports.newOrderNotification = database.ref("/orders/{orderId}")
  .onCreate(async (snapshot, context) => {
    const order = snapshot.val();
    if (!order) return null;

    try {
      // Fetch all providers from Firestore
      const providerSnap = await db
        .collection("users")
        .where("role", "==", "provider")
        .get();

      // Collect tokens from all devices of all providers
      const tokens = providerSnap.docs
        .flatMap(doc => doc.data()?.fcmTokens || [])
        .filter(Boolean);

      if (!tokens.length) {
        console.log("No provider tokens found.");
        return null;
      }

      // Send multicast notification
      return messaging.sendMulticast({
        tokens,
        notification: {
          title: "New Order 🆕",
          body: `New order for ${order?.service?.title || "a service"} is available!`,
        },
        data: {
          orderId: context.params.orderId,
          type: "NEW_ORDER",
        },
      });

    } catch (error) {
      console.error("Error sending new order notification:", error);
      return null;
    }
  });

/* ======================================================
   2️⃣ ORDER UPDATES → Customer + Provider notifications
   ====================================================== */
exports.orderUpdateNotifications = database.ref("/orders/{orderId}")
  .onUpdate(async (change, context) => {
    const before = change.before.val() || {};
    const after = change.after.val() || {};

    if (!after) return null;

    try {
      const customerId = after.userId;
      const providerId = after.providerId;

      // ---------- FETCH CUSTOMER TOKENS ----------
      const customerSnap = customerId
        ? await db.collection("users").doc(customerId).get()
        : null;
      const customerTokens = customerSnap?.exists
        ? customerSnap.data()?.fcmTokens || []
        : [];

      // ---------- FETCH PROVIDER TOKENS ----------
      const providerSnap = providerId
        ? await db.collection("users").doc(providerId).get()
        : null;
      const providerTokens = providerSnap?.exists
        ? providerSnap.data()?.fcmTokens || []
        : [];
      const providerName = providerSnap?.data()?.name || "Provider";

      const serviceTitle = after?.service?.title || "your service";

      // ---------- CUSTOMER NOTIFICATIONS ----------
      if (before.status !== "ACCEPTED" && after.status === "ACCEPTED" && customerTokens.length > 0) {
        await messaging.sendMulticast({
          tokens: customerTokens,
          notification: {
            title: "Order Accepted ✅",
            body: `${providerName} accepted your order.`,
          },
          data: { orderId: context.params.orderId, type: "ORDER_ACCEPTED" },
        });
      }
      else if (before.status !== "IN_PROGRESS" && after.status === "IN_PROGRESS" && customerTokens.length > 0) {
        await messaging.sendMulticast({
          tokens: customerTokens,
          notification: {
            title: "Service Started 🧼",
            body: `${serviceTitle} is now in progress.`,
          },
          data: { orderId: context.params.orderId, type: "SERVICE_STARTED" },
        });
      }
      else if (before.status !== "COMPLETED" && after.status === "COMPLETED" && customerTokens.length > 0) {
        await messaging.sendMulticast({
          tokens: customerTokens,
          notification: {
            title: "Service Completed 🎉",
            body: `${serviceTitle} has been completed.`,
          },
          data: { orderId: context.params.orderId, type: "SERVICE_COMPLETED" },
        });
      }
      else if (before.status !== "CANCELLED" && after.status === "CANCELLED" && customerTokens.length > 0) {
        await messaging.sendMulticast({
          tokens: customerTokens,
          notification: {
            title: "Order Cancelled ❌",
            body: `${serviceTitle} was cancelled.`,
          },
          data: { orderId: context.params.orderId, type: "ORDER_CANCELLED" },
        });
      }

      // ---------- PROVIDER PAYMENT NOTIFICATIONS ----------
      if (before.payment_status !== "PAID" && after.payment_status === "PAID" && providerTokens.length > 0) {
        await messaging.sendMulticast({
          tokens: providerTokens,
          notification: {
            title: "Payment Received 💰",
            body: "Customer has completed payment.",
          },
          data: { orderId: context.params.orderId, type: "PAYMENT_RECEIVED" },
        });
      }

      return null;

    } catch (error) {
      console.error("Error sending update notification:", error);
      return null;
    }
  });