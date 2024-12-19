
const UserModal = require('../../models/User').UserModel;
const NftModal = require('../../models/Nft').NftModal;


class NftController {


    //user
    static async CreateNft(req, res) {
        const data = req.body;
        console.log(data);
        try {
            const nftData = new NftModal(data);
            const savedData = await nftData.save();
            return res.status(201).json({ message: "Data saved successfully", data: savedData });
        } catch (error) {
            console.error("Error saving data:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }


    //admin
    static async apporoveNftStatusForGoverment(req, res) {
        const { id } = req.params;
        const { isAdminApproved } = req.body;

        // Validate input
        if (typeof isAdminApproved !== "boolean") {
            return res.status(400).json({ error: "'isAdminApproved' should be a boolean value" });
        }

        try {
            // Find the NFT by ID and update its status
            const updatedNft = await NftModal.findByIdAndUpdate(
                id,
                { isAdminApproved },
                { new: true } // Return the updated document
            );

            if (!updatedNft) {
                return res.status(404).json({ error: "NFT not found" });
            }

            return res.status(200).json({
                message: "isAdminApproved status updated successfully",
                data: updatedNft
            });
        } catch (error) {
            console.error("Error updating isAdminApproved status:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async fetchApprovedNfts(req, res) {
        try {
            const approvedNfts = await NftModal.find({ isAdminApproved: true });
            return res.status(200).json({
                message: "Approved NFTs retrieved successfully",
                data: approvedNfts
            });
        } catch (error) {
            console.error("Error fetching approved NFTs:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async unApprovedNfts(req, res) {
        try {
            const unapprovedNfts = await NftModal.find({ isAdminApproved: false });
            return res.status(200).json({
                message: "Unapproved NFTs retrieved successfully",
                data: unapprovedNfts
            });
        } catch (error) {
            console.error("Error fetching unapproved NFTs:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    //goverment

    static async apporoveNftStatusForFinalProcess(req, res) {
        const { id } = req.params;
        const { isGovermentApproved } = req.body;

        // Validate input
        if (typeof isGovermentApproved !== "boolean") {
            return res.status(400).json({ error: "'isGovermentApproved' should be a boolean value" });
        }

        try {
            const nft = await NftModal.findById(id);

            if (!nft) {
                return res.status(404).json({ error: "NFT not found" });
            }

            if (!nft.isAdminApproved) {
                return res.status(400).json({ error: "NFT not approved by admin" });
            }

            if (nft.isGovermentApproved === isGovermentApproved) {
                return res.status(400).json({ error: "NFT is already approved by the government" });
            }

            const updatedNft = await NftModal.findByIdAndUpdate(
                id,
                { isGovermentApproved },
                { new: true }
            );

            return res.status(200).json({
                message: "isGovermentApproved status updated successfully",
                data: updatedNft
            });
        } catch (error) {
            console.error("Error updating isGovermentApproved status:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }



    static async fetchApprovedNftsForGoverment(req, res) {
        try {
            const approvedNfts = await NftModal.find({ isGovermentApproved: true });
            return res.status(200).json({
                message: "Approved NFTs retrieved successfully",
                data: approvedNfts
            });
        } catch (error) {
            console.error("Error fetching approved NFTs:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async unApprovedNftsGoverment(req, res) {
        try {
            const unapprovedNfts = await NftModal.find({ isGovermentApproved: false });
            return res.status(200).json({
                message: "Unapproved NFTs retrieved successfully",
                data: unapprovedNfts
            });
        } catch (error) {
            console.error("Error fetching unapproved NFTs:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

}


exports = module.exports = NftController;