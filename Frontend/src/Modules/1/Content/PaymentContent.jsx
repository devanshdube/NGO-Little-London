import React, { useState, useRef } from "react";
import { UploadCloud, CreditCard, Smartphone, Check, X } from "lucide-react";
import axios from "axios";
import SmartAlert from "../../../Components/Alerts/SmartAlert";

/**
 * PaymentContent
 * - Displays a payment form
 * - Enables "Show QR" after required fields are valid
 * - Shows QR (Google Charts API) for quick scanning
 * - Allows uploading a payment screenshot and "confirm payment"
 *
 * Notes:
 * - Replace UPLOAD_ENDPOINT with your server endpoint to actually receive screenshots.
 * - Google Chart QR is used for quick QR generation: no extra npm packages required.
 */

const UPLOAD_ENDPOINT = "http://localhost:5555/api/payments/uploadReceipt"; // change as needed

const PaymentContent = () => {
  // form fields
  const [payerName, setPayerName] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI"); // UPI | Card | NetBanking
  const [note, setNote] = useState("");

  // UI state
  const [showQR, setShowQR] = useState(false);
  const [qrPayload, setQrPayload] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  // upload state
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);

  // small helper to show alerts
  const showAlert = (type, message, autoClose = 4000) => {
    setAlert({ type, message });
    if (autoClose)
      setTimeout(() => setAlert({ type: "", message: "" }), autoClose);
  };

  // validation: required payerName and amount > 0
  const isFormValid = () => {
    const amt = parseFloat(amount);
    return payerName.trim().length > 0 && !Number.isNaN(amt) && amt > 0;
  };

  // build a simple payment payload string depending on method
  const buildQrString = () => {
    const amt = parseFloat(amount).toFixed(2);
    // For UPI we can create a UPI-deep-link style (pa and pn are placeholders)
    if (method === "UPI") {
      // pa=payee@bank (you must replace with actual payee address)
      // For demo use a placeholder
      const pa = "merchant@upi";
      const pn = encodeURIComponent(payerName);
      const tr = `INV${Date.now()}`; // transaction ref
      // UPI URL (many UPI apps accept this)
      return `upi://pay?pa=${pa}&pn=${pn}&am=${amt}&tn=${encodeURIComponent(
        note
      )}&tr=${tr}&cu=INR`;
    }

    // For card or netbanking, show a generic payment link / instruction
    const ref = `PAY-${Date.now()}`;
    return `PAYMENT|method:${method}|name:${payerName}|amount:${amt}|ref:${ref}|note:${note}`;
  };

  const handleShowQr = (e) => {
    e?.preventDefault?.();
    if (!isFormValid()) {
      showAlert("error", "Please enter a valid name and amount.");
      return;
    }
    const payload = buildQrString();
    setQrPayload(payload);
    setShowQR(true);
  };

  const handleCloseQr = () => {
    setShowQR(false);
    setQrPayload("");
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // Accept images only
    if (!f.type.startsWith("image/")) {
      showAlert("error", "Please upload an image file (png/jpeg).");
      return;
    }
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleConfirmPayment = async () => {
    // require QR shown or a file present to confirm
    if (!showQR) {
      showAlert(
        "error",
        "Please generate and scan the QR before confirming payment."
      );
      return;
    }
    if (!file) {
      showAlert("error", "Please upload a payment screenshot/receipt.");
      return;
    }

    // optionally upload to server
    if (UPLOAD_ENDPOINT) {
      try {
        setUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append("receipt", file);
        formData.append("payerName", payerName);
        formData.append("amount", amount);
        formData.append("method", method);
        formData.append("note", note);
        formData.append("qrPayload", qrPayload);

        // axios upload with progress
        const res = await axios.post(UPLOAD_ENDPOINT, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const pct = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(pct);
          },
        });

        // server should respond with success
        if (res?.data?.status === "Success" || res?.status === 200) {
          showAlert(
            "success",
            res.data?.message || "Payment confirmed and receipt uploaded."
          );
          // reset form
          setPayerNameAndReset();
        } else {
          showAlert("error", res.data?.message || "Upload failed. Try again.");
        }
      } catch (err) {
        console.error("Upload error:", err);
        showAlert(
          "error",
          err?.response?.data?.message || "Upload failed. Check server."
        );
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    } else {
      // no endpoint: simulate success
      showAlert("success", "Payment confirmed (simulated).");
      setPayerNameAndReset();
    }
  };

  const setPayerNameAndReset = () => {
    // release preview URL
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
    setShowQR(false);
    setQrPayload("");
    setAmount("");
    setPayerName("");
    setMethod("UPI");
    setNote("");
  };

  return (
    <div>
      {/* SmartAlert (top-right) */}
      <SmartAlert
        alert={alert}
        onClose={() => setAlert({ type: "", message: "" })}
      />

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Make a Payment</h3>
          <div className="text-sm text-gray-500">Secure & quick</div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleShowQr();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payer Name
              </label>
              <input
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                className="w-full rounded-md border border-gray-200 p-2 bg-gray-50"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (INR)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-md border border-gray-200 p-2 bg-gray-50"
                placeholder="e.g. 499.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-md border border-gray-200 p-2 bg-gray-50"
              >
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="NetBanking">NetBanking</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note (optional)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-md border border-gray-200 p-2 bg-gray-50"
                placeholder="Order #1234 or purpose"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`px-4 py-2 rounded-md text-white font-medium transition ${
                isFormValid()
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isFormValid() ? "Show QR" : "Fill required fields"}
            </button>

            <button
              type="button"
              onClick={() => {
                setPayerNameAndReset();
                showAlert("success", "Form cleared.");
              }}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* QR Section */}
      {showQR && qrPayload && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Scan to Pay</h4>
              <p className="text-sm text-gray-600 mb-3">Method: {method}</p>

              {/* Google Chart QR image */}
              <img
                src={`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(
                  qrPayload
                )}`}
                alt="payment-qr"
                className="w-48 h-48 object-contain border rounded-md"
              />

              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => {
                    // copy payload to clipboard for easy paste
                    navigator.clipboard
                      .writeText(qrPayload)
                      .then(() =>
                        showAlert("success", "Payment data copied to clipboard")
                      )
                      .catch(() => showAlert("error", "Failed to copy"));
                  }}
                  className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 border"
                >
                  Copy Payload
                </button>

                <button
                  onClick={() => {
                    // download QR image
                    const url = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(
                      qrPayload
                    )}`;
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `payment-qr-${Date.now()}.png`;
                    a.click();
                  }}
                  className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 border"
                >
                  Download QR
                </button>

                <button
                  onClick={handleCloseQr}
                  className="px-3 py-2 rounded-md text-white bg-rose-500 hover:bg-rose-600"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Right side: upload screenshot */}
            <div className="flex-1">
              <h4 className="text-lg font-semibold mb-2">
                Upload Payment Screenshot
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                After scanning and paying, upload the receipt or screenshot
                here.
              </p>

              <div className="border border-dashed border-gray-200 rounded-md p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center">
                    <UploadCloud size={24} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-700">PNG, JPG up to 5MB</p>
                    <div className="mt-2 flex items-center gap-2">
                      <label
                        htmlFor="file"
                        className="px-3 py-2 bg-purple-600 text-white rounded cursor-pointer"
                      >
                        Choose file
                      </label>
                      <input
                        id="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        type="file"
                        className="hidden"
                      />
                      {file && (
                        <button
                          onClick={handleRemoveFile}
                          className="px-3 py-2 border rounded text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {filePreview && (
                  <div className="mt-3 flex items-start gap-3">
                    <img
                      src={filePreview}
                      alt="preview"
                      className="w-28 h-20 object-cover rounded-md border"
                    />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {Math.round(file.size / 1024)} KB
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => {
                            // quick local download of preview
                            const a = document.createElement("a");
                            a.href = filePreview;
                            a.download = file.name;
                            a.click();
                          }}
                          className="px-3 py-1 text-sm rounded border"
                        >
                          Download
                        </button>

                        <button
                          onClick={handleRemoveFile}
                          className="px-3 py-1 text-sm rounded border"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm payment (uploads the screenshot) */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleConfirmPayment}
                  disabled={!file || uploading}
                  className={`px-4 py-2 rounded-md text-white font-medium transition ${
                    !file || uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {uploading
                    ? `Uploading ${uploadProgress}%`
                    : "Confirm Payment"}
                </button>

                <button
                  onClick={() => {
                    setShowQR(false);
                    setQrPayload("");
                    showAlert("warning", "QR closed");
                  }}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* small note when QR not shown */}
      {!showQR && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">
            <p>
              After you click <strong>Show QR</strong>, a QR will be generated.
              Scan it with your banking / UPI app to pay the required amount.
              Then upload the screenshot and click
              <strong> Confirm Payment</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentContent;
