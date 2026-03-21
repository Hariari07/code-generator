
    
    // Own file service ts
    service = inject();
    
    //  Data Var
    seqData: any[] = [];
    isLoading: boolean = false;
    userProfileRefno: any;
    refNouserProfile: any;
    editRefNouserProfile: any;

    userProfileData: any[] = [];

    // String Var
    jbTittleSaveuserProfile: any;
    jbTittleEdituserProfile: any;
    dbTittleuserProfile: any;

    // Validator Pattern
    patterns = "^[0-9_-]{10,12}";


    // Boolean Var
    // Main page loading Progress Bar
    isMainPageLoading: boolean = true;
    
    // Save, Edit Data loading progress bar
    dataProcessLoadinguserProfile: boolean = false;

    // DialogBox
    dbVisibleuserProfile: boolean = false;


    // Display Info
    displayInfouserProfile: boolean = false;

    // Justify Box
    jbVisibleSaveuserProfile: boolean = false;
    jbVisibleEdituserProfile: boolean = false;
    
    // Edit
    isEditableuserProfile: boolean = false;

    
    // Buttons
    isBtnDisableduserProfile: boolean = false;
    
    // Roll Back
    isRollBackuserProfile: Boolean = true;

    // WorkFlow
    workFlowEnabled: boolean = false;
    selectedStage: any;

    ngOnInit(): void {  
       this.startUp();
    }

    ngAfterViewInit(): void {
      
    }
    


      async startUp() {
    try {
      // Fetch the data sequentially
      this.seqData = await this.service.seqRun();
      // Load Data
      this.userProfileRefno = await this.seqData[0].data;
      this.userProfileData = await this.seqData[1].data;     
  } catch(error: any) {
    console.error('Error loading data:', error);
  }

  }

    // Button Functions
    async applyuserProfile(){
    
    }

    async saveuserProfile(){
      this.jbOpenSaveuserProfile()
    }

    async edituserProfile(){
      this.jbOpenEdituserProfile()
    }

    async rollBackuserProfile(){
    
    }

    async resetuserProfile(){
    
    }



    
    // Reset
    resetuserProfile(){
    
    }

    // Reload
    reloaduserProfile(){
    
    }

    // Submit Functions
    insertuserProfile(payload){
      await this.service.insertuserProfile(payLoad).subscribe({
      next: async (response: any) => {
        if (response.message == "success") {
          await this.messageService.add({ severity: 'success', summary: 'success', detail: 'None Created Successfully!', life: 8000 });
          await this.resetuserProfile();
          await this.reloaduserProfile();          
        }
      }
     });
    }

    updateuserProfile(id, payload){
      await this.service.updateuserProfile(payLoad).subscribe({
      next: async (response: any) => {
        if (response.message == "success") {
          await this.messageService.add({ severity: 'success', summary: 'success', detail: 'None Updated Successfully!', life: 8000 });
          await this.resetAddress();
          await this.reload();         
        }
      }
    });
    }

    // Dialog Box funtions
    dbOpenuserProfile(){
      this.dbTittleuserProfile = "None"    
      this.dbVisibleuserProfile: boolean = true;
    }

    dbDismissuserProfile(){
      this.dbTittleuserProfile = null;
      this.dbVisibleuserProfile: boolean = false;
    }

    dbCloseEventuserProfile(){
      this.dbTittleuserProfile = null;
      this.dbVisibleuserProfile: boolean = false;
    }



    // Justify Box functions
    jbOpenSaveuserProfile(){
      this.jbTittleSaveuserProfile = "None"
      this.jbVisibleSaveuserProfile: boolean = true;
    }

    jbOpenEdituserProfile(){
      this.jbTittleEdituserProfile = "None"
      this.jbVisibleEdituserProfile: boolean = true;
    }

    jbDismissSaveuserProfile(){
      this.jbTittleSaveuserProfile = null;
      this.jbVisibleSaveuserProfile: boolean = false;
    }

       jbDismissEdituserProfile(){
      this.jbTittleEdituserProfile = null;
      this.jbVisibleEdituserProfile: boolean = false;
    }

    jbCloseEventSaveuserProfile(){
      this.jbTittleSaveuserProfile = null;
      this.jbVisibleSaveuserProfile: boolean = false;
    
    }

    jbCloseEventEdituserProfile(){
      this.jbTittleEdituserProfile = null;
      this.jbVisibleEdituserProfile: boolean = false;
    
    }

    async jbInsertuserProfile(justify: any){
      const payLoad = {
        id: ,
        data: ,
        empData: empData,
        selDbData: selDbData,
        justify: justify,
        workFlowEnabled: this.workFlowEnabled
      }
      
      this.insertuserProfile(payload);
    }

    async jbUpdateuserProfile(justify: any){
      const payLoad = {
        uniqueId: ,
        dataId: ,
        data: ,
        empData: empData,
        selDbData: selDbData,
        justify: justify,
        workFlowEnabled: this.workFlowEnabled
      }
      this.updateuserProfile(payload);
    }


  





    