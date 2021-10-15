/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import { API_URL } from "../../constants/API";
import axios from "axios";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

function OrderList() {
  const globalUser = useSelector((state) => state.user);
  const [userData, setUserData] = useState([]);
  const [uploadImg, setUploadImg] = useState({
    nameImg: "",
    previewImg:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png",
    addFile: "",
  });
  const [show, setShow] = useState(false);
  const handleClose = () => {
    console.log("Close");
    setShow(false);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(API_URL + "/order/orderData", {
        params: {
          iduser: globalUser.user.iduser,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUserData(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  const imageHandler = (e) => {
    if (e.target.files[0]) {
      setUploadImg({
        ...uploadImg,
        nameImg: e.target.files[0].name,
        previewImg: URL.createObjectURL(e.target.files[0]),
        addFile: e.target.files[0],
      });
      console.log(uploadImg.nameImg);
    }
  };

  const uploadBtnHandler = (e) => {
    if (uploadImg.addFile) {
      let formData = new FormData();
      formData.append("file", uploadImg.addFile);
      axios
        .patch(API_URL + "/order/payment/" + globalUser.user.iduser, formData, {
          params: {
            oldFile: userData.payment_image,
          },
        })
        .then((res) => {
          fetchData();
          Swal.fire("Upload File!", res.data.message, "success");
        })
        .catch((err) => {
          console.log(err);
          Swal.fire("Upload File!", "Upload File gagal", "error");
        });
    }
  };

  const paymentBtn = () => {
    console.log(show);
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Kirim Bukti Pembayaran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column justify-content-center">
            <img
              src={
                !userData.payment_image
                  ? uploadImg.previewImg
                  : uploadImg.addFile
                  ? uploadImg.previewImg
                  : API_URL + userData.payment_image
              }
              className="img-fluid rounded z-depth-2 "
              alt="Cinque Terre"
            ></img>
          </div>
          <input
            onChange={imageHandler}
            className="form-control mt-3"
            type="file"
            placeholder="input title here"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={uploadBtnHandler}
            disabled={!uploadImg.addFile ? "disabled" : null}
          >
            Upload Payment
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div className="content-user">
      <div className="content">
        <div className="container-fluid">
          <div className="container pt-4">
            <h2 className="text-center">Daftar Transaksi</h2>
            <div className="line mb-4" />
            <div className="pb-4">
              <div className="card w-full shadow-lg">
                <div className="card-body">
                  <div className="row mb-1">
                    <div className="col-md-10">
                      <h6 className="text-muted font-weight-light">
                        Id Transaksi: 12211
                      </h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="row">
                        <div className="col">
                          <h6 className=" m-0">Harga Obat</h6>
                          <p className="text-secondary">Rp.121.111</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="row">
                        <i className="bi bi-calendar-event" />
                        <div className="col">
                          <h6 className="m-0">Tanggal 24 januari 2020</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <span className="btn btn-warning btn-sm disabled text-white">
                        Menunggu
                      </span>
                    </div>
                    <div className="col-md-2 text-center">
                      <button className="btn btn-warning" onClick={handleShow}>
                        Bayar Sekarang
                      </button>
                      {paymentBtn()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderList;
