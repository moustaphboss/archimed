import { Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useState } from "react";

export default function CapitalCallsSection() {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <h1 className="text-3xl font-medium mb-6">Capital Calls</h1>
      <div className="bg-violet-100 rounded-xl p-8 text-center">
        <h4 className="text-gray-800 text-2xl mb-4 font-medium">
          Start by adding the Company Data
        </h4>
        <button
          onClick={() => setOpenModal(true)}
          className="px-8 py-4 text-lg bg-violet-600 text-white rounded-xl"
        >
          Add company data
        </button>
      </div>

      <Modal
        show={openModal}
        className="text-gray-900 bg-slate-950 bg-opacity-70"
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>
          <span className="text-2xl text-gray-600">
            Company General Information
          </span>
        </Modal.Header>
        <Modal.Body>
          <form className="space-y-6">
            <div className="flex space-x-4">
              <div className="w-3/4">
                <Label className="block text-md font-medium text-gray-700 mb-1">
                  Company Name
                </Label>
                <TextInput type="text" />
              </div>
              <div>
                <Label className="block text-md font-medium text-gray-700 mb-1">
                  Fee percentage (%)
                </Label>
                <TextInput type="number" />
              </div>
            </div>
            <div className="w-full">
              <Label className="block text-md font-medium text-gray-700 mb-1">
                IBAN
              </Label>
              <TextInput type="text" />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex space-x-4 justify-end w-full">
            <Button
              className={`${
                isLoading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-purple-600 text-white text-xl"
              } flex items-center`}
              onClick={() => {}}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <i className="fi-rr-menu-dots animate-spin mr-4 mt-0.5"></i>
                  Saving...
                </div>
              ) : (
                <>
                  <i className="fi-rr-disk mr-4 mt-0.5"></i>
                  Save
                </>
              )}
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
